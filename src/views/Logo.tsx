export default function Logo() {
  console.log("logo rendered");

  return (
    <div
      className="boot-logo"
      style={{
        background: "#000",
        color: "#55ff55",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        fontFamily: "monospace",
      }}
    >
      ZENDIUM
    </div>
  );
}
