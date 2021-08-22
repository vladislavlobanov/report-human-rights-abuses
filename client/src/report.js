export default function Report() {
    return (
        <div className="reportContainer">
            <h1>Report component</h1>
            <form>
                <label htmlFor="who">Who:</label>
                <input name="who" />
                <label htmlFor="what">What:</label>
                <input name="what" />
                <label htmlFor="when">When:</label>
                <input name="when" />
                <label htmlFor="where">Where:</label>
                <input name="where" />
                <label htmlFor="why">Why:</label>
                <input name="why" />
                <button>Report</button>
            </form>
        </div>
    );
}
