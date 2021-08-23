export default function InfoCard({ drafts }) {
    return (
        <>
            <h3>Info Cards</h3>
            {drafts.map((draft) => (
                <div key={draft.id}>
                    <div>Who: {draft.who}</div>
                    <div>What: {draft.what}</div>
                    <div>When: {draft.whenhappened}</div>
                    <div>
                        Where: {draft.longitude}, {draft.latitude}
                    </div>
                    <div>Why: {draft.why}</div>
                </div>
            ))}
        </>
    );
}
