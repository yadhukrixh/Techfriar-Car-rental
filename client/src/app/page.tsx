
import Home from "@/modules/user/home-page/views";
import styles from "./page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Home />
      </main>
    </div>
  );
}
