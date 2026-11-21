import "./HelpButton.css";

export default function HelpButton() {
  return (
    <button type="button" className="ajuda-flutuante" aria-label="Ajuda" title="Ajuda">
      <span aria-hidden="true">?</span>
    </button>
  );
}
