import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
export default function Page({ pageExists, slug }) {
  if (!pageExists) {
    return <div><Navbar/><main className="min-h-[79vh]">This is a incomplete page.</main><Footer/></div>;
  }
}
