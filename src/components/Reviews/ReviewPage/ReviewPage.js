/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import { toaster } from 'evergreen-ui';

import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
import Router from "next/router";
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import { useDropzone } from 'react-dropzone';
import CancelIcon from '@material-ui/icons/Cancel';
import { v4 as uuidv4 } from 'uuid';

const visibilityLabel = {
    1: 'Extremely poor (<5ft)',
    2: 'Poor (5-10ft)',
    3: 'Average (10-30ft)',
    4: 'Good (30-100ft)',
    5: 'Amazing (100ft/30m+)',
}

const ReviewPage = (props) => {

    const router = useRouter()
    const { beachid } = router.query
    const [activity, setActivity] = React.useState('snorkel');
    const [rating, setRating] = React.useState(0);
    const [name, setName] = React.useState(props.name);
    const [text, setText] = React.useState('');
    const [visibility, setVisibility] = React.useState('');
    //where the files are stored along with their urls
    const [fileRecords, setFileRecords] = React.useState([]);
    const [visibilityHover, setVisibilityHover] = React.useState(undefined)
    const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!router.isReady) return;

        if (!props.name) {
            fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setName(data.data.name);
            })
        }
    }, [router.isReady])

    //creates an image for each of the urls the user has submitted
    const RenderUrls = () => {

        const removeFile = (index) => {
            fileRecords.splice(index, 1)
            setFileRecords([...fileRecords])
        }

        return (
            fileRecords.map(function (object, i) {
                return (

                    <div key={object.url} className={styles.photooutercontainer}>
                        <div className={styles.photocontainer}>
                            <div className={styles.individualphotoupload}>
                                <div className={styles.containerdropzone}>
                                    <img className={styles.image} src={object.url} layout='fill' alt="pic preview" >
                                    </img>
                                </div>
                                <div className={styles.xicon} onClick={() => removeFile(i)}>
                                    <CancelIcon fontSize="small"></CancelIcon>
                                </div>
                            </div>
                        </div>
                    </div>

                )
            })
        )

    }
    //submission of the actual review
    const submitReview = async (body) => {

        setIsSubmitDisabled(true);

        async function uploadPhoto(file) {

            const filename = await encodeURIComponent(file.name);
            const res = await fetch(`${rootDomain}/s3-upload?file=reviews/${filename}`);
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
        };
        let fileNames = []
        for (let i = 0; i < fileRecords.length; i++) {
            await uploadPhoto(fileRecords[i].file)
            fileNames.push(fileRecords[i].file.name)
        }
        
        body.images = fileNames
        

        fetch(`${rootDomain}/review/add`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
            },
        }).then(response => {
            if (response.ok) {
                sendEvent('review_submit', {
                    'site_id': body.beach_id,
                });
                Router.push(`/Beach/${body['beach_id']}`)
            } else {
                setIsSubmitDisabled(false)
                response.json().then(({ msg }) => toaster.danger(msg));
            }

        })
    }

    const DropZoneArea = () => {

        const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'image/*' });

        return (
            <div>
                {acceptedFiles.length < 2 &&
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzone}>
                            <div className={styles.fileupload}>
                                <div className={styles.plusicon}>
                                    +
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <FileSubmit submittedFile={acceptedFiles}></FileSubmit>
            </div>
        )
    }
    //this is called after each time the user selects a photo
    //actualfile represents the 
    function FileSubmit({ submittedFile }) {

        let f = null;

        if (submittedFile) {
            submittedFile.map(file => {
                f = file;
            })
        }

        React.useEffect(() => {

            //make sure users cannot upload more than 10 photos
            if (f && fileRecords.length == 10) {
                toaster.danger("Each review can have at most 10 photos.")
            }
            if (f && !(fileRecords.length > 9)) {
                //create the uuid and place in front of file name 
                const rand = uuidv4();
                let testid = rand + '_' + f.path
                const myNewFile = new File([f], testid, { type: f.type });
                const objUrl = URL.createObjectURL(myNewFile)
                let newFileRecord = {
                    file: myNewFile,
                    url: objUrl
                }
                let fileRecordsCopy = fileRecords
                fileRecordsCopy.push(newFileRecord)
                setFileRecords([...fileRecordsCopy])

            }


        }, [submittedFile]);

        return (<div />)

    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.beachtitle}>{name}</div>
                <div className={styles.spacer}>
                    <ScubaSnorkel value={activity} onChange={setActivity}></ScubaSnorkel>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Rating
                    </div>
                    <StarRate value={rating} onChange={setRating}></StarRate>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Review
                    </div>
                    <textarea value={text} onChange={e => setText(e.target.value)} className={styles.paragraphreview}>
                    </textarea>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Visibility
                    </div>
                    <StarRate value={visibility} onChange={setVisibility} onHover={setVisibilityHover}></StarRate>
                    <div className={styles.visibilityLabel}>{visibilityLabel[visibility || visibilityHover]}</div>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Photos
                    </div>
                    <div className={styles.photoscontainer}>
                        <div className={styles.photooutercontainer}>
                            <div className={styles.individualphotoupload}>
                                <div className={styles.containerdropzone}>
                                    <DropZoneArea></DropZoneArea>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <RenderUrls></RenderUrls>
                    </div>
                </div>
                <PrimaryButton className={styles.nextbutton} disabled={isSubmitDisabled} onClick={() => submitReview({
                    'activity_type': activity,
                    rating,
                    text,
                    visibility,
                    beach_id: beachid,
                })}>
                    Submit
                </PrimaryButton>
            </div>
        </Layout>
    )
}

export default ReviewPage;