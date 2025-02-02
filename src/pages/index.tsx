import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic"; // Add this import statement

const QuillEditor = dynamic(() => import("@/components/QuillEditor"), {
    ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            {/* <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head> */}
            <main className={`${styles.main} ${inter.className}`}>
                <div style={{ marginTop: "20px" }}>
                    <h2>Collaborative Editor</h2>
                    <QuillEditor />
                </div>
            </main>
        </>
    );
}
