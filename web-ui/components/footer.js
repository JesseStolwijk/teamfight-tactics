import Link from "next/link";

const Footer = () => {
  return (
    <div className="border border-white p-4">
      <div className="container mx-auto">
        <div className="font-semibold text-xl">
          <Link href="https://twitter.com/jessestolwijk">Contact</Link>
        </div>
        <div className="font-semibold text-xl">
          <Link href="https://github.com/JesseStolwijk/teamfight-tactics">Source code</Link>
        </div>{" "}
        <p className="font-semibold text-xl">Current branch - master rev. 1</p>
      </div>
    </div>
  );
};

export default Footer;
