import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  const redirectToOrders = () => {
    router.push("/orders");
  };

  return (
    <>
      <div className="text-success">payment successful</div>
      <button className="btn btn-success" onClick={redirectToOrders}>Go to orders</button>
    </>
  );
}
