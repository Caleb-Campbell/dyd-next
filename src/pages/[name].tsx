import { Timeline } from "~/components/Timeline";
import { useRouter } from "next/router";

export default function UserPage(){

    const router = useRouter()

    const name = router.query.name as string

    return (
        <div>
            <Timeline where={{
                author: {
                    name,
                }
            }} />
        </div>
    )
}