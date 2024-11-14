import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
export default function Page({ pageExists, slug }) {
  if (!pageExists) {
    return <div><Navbar/><main className="min-h-[79vh]">This is a incomplete page.</main><Footer/></div>;
  }
}
