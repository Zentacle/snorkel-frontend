import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import Image from 'next/image';
import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
import Router from "next/router";
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import { useDropzone } from 'react-dropzone';
import { useS3Upload } from 'next-s3-upload';
import { resetWarningCache } from 'prop-types';
import { PhotoSharp } from '@material-ui/icons';


const ReviewPage = (props) => {
    const router = useRouter()
    const { beachid } = router.query
    const [activity, setActivity] = React.useState('snorkel');
    const [rating, setRating] = React.useState(0);
    const [name, setName] = React.useState(props.name);
    const [text, setText] = React.useState('');
    const [visibility, setVisibility] = React.useState('');
    const [urls, setUrls] = React.useState([]);
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        if (!router.isReady) return;

        sendEvent('review_begin', {
            'site_id': beachid,
        })

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


    const RenderUrls = ({ urls }) => {
        console.log("render urls")

        return (
            urls.map(function (object, i) {
                return (
                    <div>
                        <div className={styles.photooutercontainer}>

                            <div className={styles.photocontainer}>
                                <div className={styles.individualphotoupload}>
                                    <div className={styles.containerdropzone}>
                                        <img key={object} className={styles.image} src={object} layout='fill' alt="pic preview" >

                                        </img>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        )

    }
    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

    function submitReview(body) {

        let theBlob = null;

        console.log(files)

        if (urls.length > 0) {
            let url = uploadToS3(files[0]).then(response => {

                console.log(response);
            });
        }
        // fetch(`${rootDomain}/review/add`, {
        //     method: 'POST',
        //     body: JSON.stringify(body),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
        //     },
        // }).then(response => {
        //     if (response.ok) {
        //         sendEvent('review_submit', {
        //             'site_id': body.beach_id,
        //         });
        //         Router.push(`/Beach/${body['beach_id']}`)
        //     } else {
        //         response.json().then(({ msg }) => toaster.danger(msg));
        //     }
        //     return response.json()
        // })
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
                <FileSubmit actualFile={acceptedFiles}></FileSubmit>
            </div>
        )
    }




    function FileSubmit({ actualFile }) {

        let f = null;

        if (actualFile) {
            actualFile.map(file => {
                f = file;
            })
        }
        React.useEffect(() => {

            if (f) {
                const rand = (Math.random()).toString().substring(3, 10)
                let testid = rand + f.path
                const myNewFile = new File([f], testid, { type: f.type });
                let fileImages = files;
                fileImages.push(myNewFile);
                setFiles([...fileImages])
                let images = urls;
                images.push(URL.createObjectURL(myNewFile))
                setUrls([...images])
                console.log("in filesubmit")

            }

        }, [f]);

        return (
            <div>
            </div>
        )
    }
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.beachtitle}>{name}</div>
                <div className={styles.spacer}>
                    <ScubaSnorkel value={activity} onChange={setActivity}></ScubaSnorkel>
                </div>
                <div className={styles.spacer}>
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
                    <div className={styles.vizreview}>
                        <input value={visibility} onChange={e => setVisibility(e.target.value)} placeholder="visibility (ft)"></input>
                    </div>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Photos
                    </div>
                    <div className={styles.photoscontainer}>
                        <div className={styles.photooutercontainer}>
                            <div className={styles.photocontainer}>
                                <div className={styles.individualphotoupload}>
                                    <div className={styles.containerdropzone}>
                                        <DropZoneArea></DropZoneArea>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <RenderUrls urls={urls}></RenderUrls>
                    </div>
                </div>
                <PrimaryButton className={styles.nextbutton} onClick={() => submitReview({
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