import Layout from "components/Layout";
import { GetServerSidePropsContext, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

  console.log(props[0], "===============>");
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          ANAANNANANANNANANANNANANNANANNA
        </div>
        {session ? <p>var</p> : <p>yok</p>}
      </Layout>
    </>
  );
}

//@ts-ignore
export const GetServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permananet: false,
      },
    };
  }

  return {
    props: { session },
  };
};
