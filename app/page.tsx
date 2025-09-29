import Image from "next/image";
import Welcome from "./components/Welcome";

export default function Home() {
  console.log("sup");

  return (
<div className="center">
  <div>
    <h1 className="text-4xl font-bold">
    Welcome To StoreIT
    </h1>
  </div>
</div>
  );
}
