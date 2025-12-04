
import PDFListPage from "../components/PDFListPage";

export default function UserUploads() {
  const username = "Briggs";
  const currentUser = "Briggs";  
  const isOwner = currentUser === username;

  const subtitle = isOwner
    ? "Take a look at your uploaded posts!"
    : `Take a look at ${username}'s uploaded posts!`;

  const uploads = [];

  return (
    <PDFListPage
      pageTitle={`${username}'s Uploaded Posts`}
      pageSubtitle={subtitle}
      items={uploads}
    />
  );
}