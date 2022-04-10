/* eslint-disable @next/next/no-img-element */
import styles from "components/EditBeach/EditBeach.module.css"
import { useRouter } from "next/router";
import React from "react";
import { clientSideDomain, rootDomain } from "lib/constants";
import SignupInput from "components/SignupInput";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';
import PrimaryButton from "components/PrimaryButton";
import { toaster } from 'evergreen-ui';
import Cookies from 'js-cookie';
import GooglePlaceSelector from "components/GooglePlaceSelector";
import searchGoogleMapsAPI from "lib/searchGoogleMapsAPI";

const BeachEditComponent = () => {
    const [oldData, setOldData] = React.useState('');
    const [newData, setNewData] = React.useState({});

    const [newHeroImage, setNewHeroImage] = React.useState('');
    const [newEntryMap, setNewEntryMap] = React.useState('');

    const [googlePlaceCandidates, setGooglePlaceCandidates] = React.useState(null);
    const [selectedGooglePlace, setSelectedGooglePlace] = React.useState(null);

    const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);

    let router = useRouter();
    const { beachid } = router.query;

    const setLatLng = (latitude, longitude) => {
        setNewData({
            ...newData,
            latitude,
            longitude,
        });
    }

    const conductSearch = (name) => () => {
        searchGoogleMapsAPI(name).then(results => {
            setGooglePlaceCandidates(results);
            if (results.length === 1) {
                setSelectedGooglePlace(results[0]);
            }
        });
    }

    const setSelected = (index) => () => {
        setSelectedGooglePlace(googlePlaceCandidates[index])
        if(index !== null) {
            changeNewData('google_place_id')(googlePlaceCandidates[index]['place_id'])
        } else {
            delete newData.google_place_id;
            setNewData({
                ...newData,
            })
        }
    }

    React.useEffect(() => {
        if (beachid) {
            fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
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
    }, [router.isReady, beachid])

    function FileSubmit({ submittedFile, type }) {
        let f = null;

        if (submittedFile) {
            submittedFile.map(file => {
                f = file;
            })
        }

        React.useEffect(() => {
            if (f) {
                //create the uuid and place in front of file name 
                const rand = uuidv4();
                let testid = rand + '_' + f.path
                const myNewFile = new File([f], testid, { type: f.type });
                const objUrl = URL.createObjectURL(myNewFile)
                let newFileRecord = {
                    file: myNewFile,
                    url: objUrl
                }
                if (type === 'hero_img') {
                    setNewHeroImage(newFileRecord)
                }
                else if (type === 'entry_map') {
                    setNewEntryMap(newFileRecord)
                }
            }
        }, [submittedFile, f]);

        return (
            <div>
                {type === 'hero_img' &&
                    <div className={styles.imageContainer}>
                        <img className={styles.image} src={newHeroImage.url} alt="hero image"></img>
                    </div>}
                {type === 'entry_map' && <div className={styles.imageContainer}>
                    <img className={styles.image} src={newEntryMap.url} alt="entry map image"></img>
                </div>}
            </div>
        )
    }

    const DropZoneArea = ({ type }) => {
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
        async function uploadPhoto(file, directory) {

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

        async function patchBeach(patchBody) {
            fetch(`${clientSideDomain}/spots/patch`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...patchBody
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
                },
            }).then(response => {
                if (response.ok) {
                    router.push(`${oldData.url}`)
                } else {
                    setIsSubmitDisabled(false)
                    response.json().then(({ msg }) => toaster.danger("You must be an admin to edit locations"));
                }
            })
        }

        let entryName = '';
        let heroName = '';
        let requestBody = newData;
        const s3Url = "https://snorkel.s3.amazonaws.com/";
        if (newEntryMap.file) {
            entryName = await uploadPhoto(newEntryMap.file, "entry")
            requestBody.entry_map = s3Url + "entry/" + entryName;
        }
        if (newHeroImage.file) {
            heroName = await uploadPhoto(newHeroImage.file, "hero")
            requestBody.hero_img = s3Url + "hero/" + heroName;
        }

        if (requestBody !== {}) {
            requestBody.id = oldData.id;
            await patchBeach(requestBody);
        }
    }

    const changeNewData = (key) => (value) => {
        setNewData({
            ...newData,
            [key]: value,
        });
    }

    const getValueForKey = (key) => {
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
                <SignupInput value={getValueForKey('name')} onChange={changeNewData('name')}></SignupInput>
                <div>description</div>
                <textarea className={styles.textarea} value={getValueForKey('description')} onChange={e => changeNewData('description')(e.target.value)}></textarea>
                <div>max depth</div>
                <SignupInput value={getValueForKey('max_depth')} onChange={changeNewData('max_depth')}></SignupInput>
                <div>hero_img</div>
                <DropZoneArea type="hero_img"></DropZoneArea>
                <div>entry_map</div>
                <DropZoneArea type="entry_map"></DropZoneArea>
                <div>difficulty</div>
                <SignupInput value={getValueForKey('difficulty')} onChange={changeNewData('difficulty')}></SignupInput>
                <div>location_city</div>
                <SignupInput value={getValueForKey('location_city')} onChange={changeNewData('location_city')}></SignupInput>
                <div>location_google</div>
                <SignupInput value={getValueForKey('location_google')} onChange={changeNewData('location_google')}></SignupInput>
                <button onClick={conductSearch(getValueForKey('name'))}>Search Google</button>
                <GooglePlaceSelector
                    setSelected={setSelected}
                    selectedGooglePlace={selectedGooglePlace}
                    googlePlaceCandidates={googlePlaceCandidates}
                    setLatLng={setLatLng}
                />
                <div>google_place_id</div>
                <SignupInput value={getValueForKey('google_place_id')} onChange={changeNewData('google_place_id')}></SignupInput>
                <PrimaryButton disabled={isSubmitDisabled} className={styles.submit} onClick={submit}>Submit</PrimaryButton>
            </div>
        </div>
    )
}

export default BeachEditComponent;
