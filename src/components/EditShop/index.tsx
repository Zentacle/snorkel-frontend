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
import Shop from 'models/Shop';

import styles from "./styles.module.css"

interface FileSubmitProps {
    type: string;
    submittedFile: any;
}

interface HeroImage {
    file: File;
    url: string;
}

const BeachEditComponent = () => {
    const [oldData, setOldData] = React.useState<Partial<Shop>>({});
    const [newData, setNewData] = React.useState<Partial<Shop>>({});
    const [newHeroImage, setNewHeroImage] = React.useState<HeroImage | undefined>(undefined);
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
            })
        }
    }, [router.isReady, id])

    function FileSubmit({ submittedFile, type }: FileSubmitProps) {
        let f: File;

        if (submittedFile) {
            submittedFile.map((file: File) => {
                f = file;
            })
        }

        React.useEffect(() => {
            if (f) {
                //create the uuid and place in front of file name
                const rand = uuidv4();
                let testid = rand + '_' + f.name
                const myNewFile = new File([f], testid, { type: f.type });
                const objUrl = URL.createObjectURL(myNewFile)
                let newFileRecord: HeroImage = {
                    file: myNewFile,
                    url: objUrl
                }
                if (type === 'logo_img') {
                    setNewHeroImage(newFileRecord)
                }
            }
        }, [submittedFile, type]);

        return (
            <div>
                {type === 'logo_img' && newHeroImage &&
                    <div className={styles.imageContainer}>
                        <img className={styles.image} src={newHeroImage.url} alt="hero image"></img>
                    </div>}
            </div>
        )
    }

    const DropZoneArea = ({ type }: { type: string }) => {
        const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'image/*' });

        return (
            <div>
                {acceptedFiles.length < 2 &&
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzone}>
                            <div className={styles.fileupload}>
                                Drag + Drop or Click
                            </div>
                        </div>
                    </div>
                }
                <FileSubmit submittedFile={acceptedFiles} type={type}></FileSubmit>
            </div>
        )
    }

    const submit = async () => {
        setIsSubmitDisabled(true);
        async function uploadPhoto(file: File, directory: string) {

            const filename = await encodeURIComponent(file.name);
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

            if (upload.ok) {
                console.log('Uploaded successfully!');
            } else {
                console.error('Upload failed.');
            }
            return filename;
        };

        async function patchBeach(patchBody: Partial<Shop>) {
            const csrf_token = Cookies.get('csrf_access_token');
            if (!csrf_token) {
                toaster.danger('You must be logged in to edit locations');
                return;
            }
            fetch(`${clientSideDomain}/shop/patch/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...patchBody
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                },
            }).then(response => {
                if (response.ok) {
                    router.push(`${oldData.url}`)
                } else {
                    setIsSubmitDisabled(false)
                    response.json().then(({ msg }) => toaster.danger(msg || "You must be an admin to edit locations"));
                }
            })
        }

        let heroName = '';
        let requestBody = newData;
        const s3Url = "https://www.zentacle.com/image/";
        if (newHeroImage && newHeroImage.file) {
            heroName = await uploadPhoto(newHeroImage.file, "shops")
            requestBody.logo_img = s3Url + "shops/" + heroName;
        }

        if (Object.keys(requestBody).length) {
            requestBody.id = oldData.id;
            await patchBeach(requestBody);
        }
    }

    const changeNewData = (key: string) => (value: string) => {
        setNewData({
            ...newData,
            [key]: value,
        });
    }

    const getValueForKey = (key: keyof Shop) => {
        if (key in newData) {
            return newData[key]
        } else {
            return oldData[key]
        }
    }

    return (
        <div>
            <div>
                <div className={styles.titlecontainer}>{oldData.name}</div>
                <div>name</div>
                <SignupInput value={getValueForKey('name')  as string | undefined || ''} onChange={changeNewData('name')}></SignupInput>
                <div>description</div>
                <textarea className={styles.textarea} value={getValueForKey('description')  as string | undefined || ''} onChange={e => changeNewData('description')(e.target.value)}></textarea>
                <div>username</div>
                <SignupInput value={getValueForKey('username') as string | undefined || ''} onChange={changeNewData('username')}></SignupInput>
                <div>logo_img</div>
                <DropZoneArea type="logo_img"></DropZoneArea>
                <PrimaryButton disabled={isSubmitDisabled} className={styles.submit} onClick={submit}>Submit</PrimaryButton>
            </div>
        </div>
    )
}

export default BeachEditComponent;
