import Layout from "components/Layout";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "~/server/db";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
};

export default function Home(props: UserProps[]) {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          ANAANNANANANNANANANNANANNANANNA
        </div>
      </Layout>
    </>
  );
}
