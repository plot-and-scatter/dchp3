import { LoaderArgs, redirect } from "@remix-run/server-runtime";

export async function loader({ request, params }: LoaderArgs) {
    return redirect(`${params.initialLetters}/1`);

}

export default function SearchIndexPage() {
    return <></>
}