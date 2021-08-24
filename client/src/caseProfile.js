export default function CaseProfile({ ...props }) {
    return (
        <>
            <h3 onClick={() => console.log(props)}>This is a secret page</h3>
        </>
    );
}
