import styles from "./page.module.css";
import Timetrack from "@/dashboard/timetrack";

export default function Home() {
  return (
    <div className={styles.container}>
      <Timetrack />
    </div>
  );
}
