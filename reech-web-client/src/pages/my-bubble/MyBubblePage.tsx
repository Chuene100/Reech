import OpportunityWizard from "@/components/ui/opportunity-wizard/OpportunityWizard"

interface Props {
    limit?: number
}

const MyBubblePage: React.FC<Props> = ({limit=10}) => {
    return (
        <>
            <OpportunityWizard />
        </>
    )
}

export {MyBubblePage}