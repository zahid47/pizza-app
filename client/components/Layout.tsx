import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
