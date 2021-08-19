import Image from 'next/image';
import Link from 'next/link';
import styles from "./styles.module.css";

const ProfilePic = ({ user, size }) => (
  <Link href={user.username ? `/user/${user.username}` : `/setusername`}>
    <a className={styles.link}>
      {
        user.profile_pic
          ? <Image className={styles.profilePic} alt={user.display_name} src={user.profile_pic} height={size} width={size} />
          : <Image className={styles.profilePic} alt={user.display_name} src='/default_profile.png' height={size} width={size} />
      }
    </a>
  </Link>
)

export default ProfilePic;
