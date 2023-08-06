import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  console.log(session, status, "========?>");

  let left = (
    <div className="left">
      <Link href="/">feed</Link>
    </div>
  );

  let right = null;

  if (status === "loading") {
    left = (
      <div className="left">
        <Link href="/">feed</Link>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">login</Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/">feed</Link>
        <Link href="/drafts">drafts</Link>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email}) {session.user.id}{" "}
          {session.user.name}
        </p>

        <button onClick={() => signOut()}>
          <a>
            <span>logout</span>
          </a>
        </button>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
