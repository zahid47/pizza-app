import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  const redirectToHome = () => {
    router.push("/");
  };

  return (
    <>
      <div className="text-danger">payment failed or canceled</div>
      <button className="btn btn-dark" onClick={redirectToHome}>Try to order again</button>
    </>
  );
}
