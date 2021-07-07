import styles from "../LoginPage/LoginPage.module.css";
//uses borrowed styling
import Layout from "../Layout/Layout";
import BackgroundCard from "../Layout/BackgroundCard/BackgroundCard";
import Link from "next/link";
const CreateButton = () => {
    return (
        <div className={styles.buttonwrapper}>
            <div className={styles.loginbutton}>
                Login
            </div>
        </div>
    )
}

const InputArea = ({ type }) => {
    return (
        <div className={styles.outerinput}>
            <input className={styles.inputs} placeholder={type}></input>
        </div>
    )
}

const Title = () => {
    return (
        <div className={styles.titlecontainer}>
            Create your Free account
        </div>
    )
}




const CreateAccount = () => {
    return (
        <Layout>
            <BackgroundCard>
                <Title>
                </Title>
                <br />
                <br />
                <InputArea type="Name"></InputArea>
                <br />
                <InputArea type="Username"></InputArea>
                <br />
                <InputArea type="Email"></InputArea>
                <br />
                <InputArea type="Password"></InputArea>
                <br />
                <br />
                <CreateButton></CreateButton>
                <br />
                <div className={styles.bottominfo}>
                    Already have an account?&nbsp;
                    <Link href="/Login">
                        <span className={styles.createone}>
                            Login!
                        </span>
                    </Link>
                </div>
            </BackgroundCard>
        </Layout>
    )
}

export default CreateAccount;