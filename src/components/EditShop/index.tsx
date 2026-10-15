/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React from "react";
import { clientSideDomain, rootDomain } from "lib/constants";
import SignupInput from "components/SignupInput";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';
import PrimaryButton from "components/PrimaryButton";
import { toaster } from 'evergreen-ui';
import Cookies from 'js-cookie';
import Shop, { ShopHours, ShopPadiData } from 'models/Shop';

import styles from "./styles.module.css"

type StringField = Exclude<{
    [K in keyof Shop]: Shop[K] extends string | undefined ? K : never
}[keyof Shop], undefined>;
type ImageField = 'logo_img' | 'hero_img' | 'stamp_uri';
type PadiListKey = 'features' | 'rentals' | 'diveTypes' | 'coursesOffered' | 'languages';

interface PendingImage {
    file: File;
    url: string;
}

interface DayHours {
    day: string;
    open: boolean;
    from: string;
    to: string;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PADI_RATINGS = [
    'PADI Dive Center',
    'PADI Dive Resort',
    'PADI 5 Star Dive Center',
    'PADI 5 Star Dive Resort',
    'PADI 5 Star Instructor Development Center (IDC)',
    'PADI 5 Star Instructor Development Dive Resort (IDDR)',
    'PADI Career Development Center (CDC)',
];

const IMAGE_FIELDS: { key: ImageField; label: string; directory: string }[] = [
    { key: 'logo_img', label: 'Logo', directory: 'shops' },
    { key: 'hero_img', label: 'Hero image', directory: 'shops' },
    { key: 'stamp_uri', label: 'Stamp', directory: 'stamp' },
];

const PADI_LISTS: { key: PadiListKey; label: string; hint: string }[] = [
    { key: 'features', label: 'Features & services', hint: 'e.g. Nitrox, Equipment Rentals, Boat Dives' },
    { key: 'rentals', label: 'Equipment rentals', hint: 'Leave empty if the shop does not rent equipment' },
    { key: 'diveTypes', label: 'Dive types', hint: 'e.g. Reef, Wreck, Night' },
    { key: 'coursesOffered', label: 'PADI courses offered', hint: 'e.g. Open Water Diver' },
    { key: 'languages', label: 'Languages', hint: 'e.g. English, Afrikaans' },
];

function hoursToDays(hours?: ShopHours[] | null): DayHours[] {
    return WEEKDAYS.map(day => {
        const entry = (hours || []).find(h => h.shopDayName?.toLowerCase() === day.toLowerCase());
        return {
            day,
            open: !!entry,
            from: entry?.shopHourOpen || '09:00',
            to: entry?.shopHourClose || '17:00',
        };
    });
}

function daysToHours(days: DayHours[]): ShopHours[] {
    return days
        .filter(d => d.open)
        .map(d => ({ shopDayName: d.day, shopHourOpen: d.from, shopHourClose: d.to }));
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
        {children}
    </label>
);

const ImageDrop = ({ current, pending, onFile }: {
    current?: string;
    pending?: PendingImage;
    onFile: (file: File) => void;
}) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        multiple: false,
        onDrop: (files: File[]) => files[0] && onFile(files[0]),
    });
    const preview = pending?.url || current;
    return (
        <div>
            <div {...getRootProps({ className: styles.dropzone })}>
                <input {...getInputProps()} />
                <div className={styles.fileupload}>Drag + Drop or Click</div>
            </div>
            {preview &&
                <div className={styles.imageContainer}>
                    <img className={styles.image} src={preview} alt="" />
                </div>}
        </div>
    );
};

async function uploadPhoto(file: File, directory: string) {
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`${rootDomain}/s3-upload?file=${directory}/${filename}`);
    const presignedPostData = await res.json();
    const formData = new FormData();

    Object.keys(presignedPostData.fields).forEach(key => {
        formData.append(key, presignedPostData.fields[key]);
    });
    // Actual file has to be appended last.
    formData.append("file", file);

    const upload = await fetch(presignedPostData.url, {
        method: 'POST',
        body: formData,
    });
    if (!upload.ok) {
        throw new Error('Image upload failed');
    }
    return filename;
}

const ShopEditComponent = () => {
    const [oldData, setOldData] = React.useState<Partial<Shop>>({});
    const [newData, setNewData] = React.useState<Partial<Record<StringField, string>>>({});
    const [days, setDays] = React.useState<DayHours[]>(hoursToDays());
    const [hoursChanged, setHoursChanged] = React.useState(false);
    const [padiEdits, setPadiEdits] = React.useState<Partial<Record<PadiListKey, string>>>({});
    const [padiRating, setPadiRating] = React.useState<string | undefined>(undefined);
    const [images, setImages] = React.useState<Partial<Record<ImageField, PendingImage>>>({});
    const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);

    let router = useRouter();
    const { id } = router.query;

    React.useEffect(() => {
        if (id) {
            fetch(`${rootDomain}/shop/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setOldData(data.data);
                setDays(hoursToDays(data.data.hours));
            })
        }
    }, [router.isReady, id])

    const getValue = (key: StringField): string => {
        if (key in newData) {
            return newData[key] || '';
        }
        const value = oldData[key];
        return value === null || value === undefined ? '' : String(value);
    }

    const setValue = (key: StringField) => (value: string) => {
        setNewData(prev => ({ ...prev, [key]: value }));
    }

    const getPadiList = (key: PadiListKey): string => {
        if (key in padiEdits) {
            return padiEdits[key] || '';
        }
        return (oldData.padi_data?.[key] || []).join('\n');
    }

    const updateDay = (index: number, changes: Partial<DayHours>) => {
        setDays(prev => prev.map((d, i) => i === index ? { ...d, ...changes } : d));
        setHoursChanged(true);
    }

    const setImage = (key: ImageField) => (file: File) => {
        // prefix a uuid so uploads never overwrite each other
        const renamed = new File([file], `${uuidv4()}_${file.name}`, { type: file.type });
        setImages(prev => ({ ...prev, [key]: { file: renamed, url: URL.createObjectURL(renamed) } }));
    }

    const buildRequestBody = async () => {
        const body: Record<string, unknown> = {};
        (Object.keys(newData) as StringField[]).forEach(key => {
            const oldValue = oldData[key] === null || oldData[key] === undefined ? '' : String(oldData[key]);
            if ((newData[key] || '').trim() !== oldValue) {
                body[key] = newData[key];
            }
        });

        if (hoursChanged) {
            body.hours = daysToHours(days);
        }

        const padiData: ShopPadiData = {};
        (Object.keys(padiEdits) as PadiListKey[]).forEach(key => {
            padiData[key] = (padiEdits[key] || '').split('\n').map(s => s.trim()).filter(Boolean);
        });
        if (padiRating !== undefined && padiRating.trim() !== (oldData.padi_data?.padiRating || '')) {
            padiData.padiRating = padiRating;
        }
        if (Object.keys(padiData).length) {
            body.padi_data = padiData;
        }

        const s3Url = "https://www.zentacle.com/image/";
        for (const { key, directory } of IMAGE_FIELDS) {
            const pending = images[key];
            if (pending) {
                const filename = await uploadPhoto(pending.file, directory);
                body[key] = `${s3Url}${directory}/${filename}`;
            }
        }
        return body;
    }

    const submit = async () => {
        const invalidDay = days.find(d => d.open && (!d.from || !d.to));
        if (invalidDay) {
            toaster.danger(`Set opening and closing times for ${invalidDay.day}`);
            return;
        }
        const csrf_token = Cookies.get('csrf_access_token');
        if (!csrf_token) {
            toaster.danger('You must be logged in to edit shops');
            return;
        }

        setIsSubmitDisabled(true);
        let body: Record<string, unknown>;
        try {
            body = await buildRequestBody();
        } catch (e) {
            toaster.danger('Image upload failed, please try again');
            setIsSubmitDisabled(false);
            return;
        }
        if (!Object.keys(body).length) {
            toaster.notify('No changes to save');
            setIsSubmitDisabled(false);
            return;
        }

        const response = await fetch(`${clientSideDomain}/shop/patch/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
            },
        });
        const json = await response.json().catch(() => ({}));
        if (response.ok) {
            toaster.success('Shop updated. The public page can take up to an hour to refresh.');
            router.push(json.data?.url || `${oldData.url}`);
        } else {
            setIsSubmitDisabled(false);
            toaster.danger(json.msg || json.message || 'Only the shop owner or an admin can edit this shop');
        }
    }

    const text = (key: StringField, label: string, hint?: string, type?: string) => (
        <Field label={label} hint={hint}>
            <SignupInput value={getValue(key)} onChange={setValue(key)} type={type}></SignupInput>
        </Field>
    );

    return (
        <div className={styles.form}>
            <div className={styles.titlecontainer}>{oldData.name}</div>
            {oldData.url && <a className={styles.viewLink} href={oldData.url}>View public page</a>}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Basics</h2>
                {text('name', 'Name')}
                {text('username', 'Username')}
                <Field label="Description" hint="HTML is allowed">
                    <textarea className={styles.textarea} value={getValue('description')} onChange={e => setValue('description')(e.target.value)}></textarea>
                </Field>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <div className={styles.grid}>
                    {text('phone', 'Main phone', undefined, 'tel')}
                    {text('email', 'Email', undefined, 'email')}
                    {text('website', 'Website', undefined, 'url')}
                    {text('fareharbor_url', 'FareHarbor booking URL', undefined, 'url')}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Address</h2>
                {text('address1', 'Address line 1')}
                {text('address2', 'Address line 2')}
                <div className={styles.grid}>
                    {text('city', 'City')}
                    {text('state', 'State / province')}
                    {text('zip', 'Postal code')}
                    {text('country_name', 'Country')}
                    {text('latitude', 'Latitude', 'Used for the map and nearby shops')}
                    {text('longitude', 'Longitude')}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Hours</h2>
                <span className={styles.hint}>Unticked days show as closed.</span>
                {days.map((d, i) => (
                    <div key={d.day} className={styles.dayRow}>
                        <label className={styles.dayName}>
                            <input type="checkbox" checked={d.open} onChange={e => updateDay(i, { open: e.target.checked })} />
                            {d.day}
                        </label>
                        <input className={styles.time} type="time" value={d.from} disabled={!d.open} onChange={e => updateDay(i, { from: e.target.value })} />
                        <span>to</span>
                        <input className={styles.time} type="time" value={d.to} disabled={!d.open} onChange={e => updateDay(i, { to: e.target.value })} />
                    </div>
                ))}
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>PADI</h2>
                <div className={styles.grid}>
                    <Field label="PADI rating" hint="Admin only. Shown as the badge on the shop page">
                        <input
                            className={styles.input}
                            list="padi-ratings"
                            value={padiRating ?? oldData.padi_data?.padiRating ?? ''}
                            onChange={e => setPadiRating(e.target.value)}
                        />
                        <datalist id="padi-ratings">
                            {PADI_RATINGS.map(r => <option key={r} value={r} />)}
                        </datalist>
                    </Field>
                    {text('padi_store_id', 'PADI store ID', 'Admin only')}
                </div>
                {PADI_LISTS.map(({ key, label, hint }) => (
                    <Field key={key} label={label} hint={`One per line. ${hint}`}>
                        <textarea
                            className={styles.textarea}
                            value={getPadiList(key)}
                            onChange={e => setPadiEdits(prev => ({ ...prev, [key]: e.target.value }))}
                        ></textarea>
                    </Field>
                ))}
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Images</h2>
                {IMAGE_FIELDS.map(({ key, label }) => (
                    <div key={key} className={styles.field}>
                        <span className={styles.label}>{label}</span>
                        <ImageDrop current={oldData[key]} pending={images[key]} onFile={setImage(key)} />
                    </div>
                ))}
            </section>

            <PrimaryButton disabled={isSubmitDisabled} className={styles.submit} onClick={submit}>Save changes</PrimaryButton>
        </div>
    )
}

export default ShopEditComponent;
