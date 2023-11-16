import ClipLoader from "react-spinners/ClipLoader";

export default function Spinner() {

    return <ClipLoader
    className="my-0 mx-auto border-red-500 block "
    color=""
    aria-label="Loading Spinner"
    data-testid="loader"
  />
}