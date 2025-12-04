
import PDFListPage from "../components/PDFListPage";

export default function UserFavorites() {
  const username = "Briggs";
  const currentUser = "Briggs";  
  const isOwner = currentUser === username;

  const subtitle = isOwner
    ? "Take a look at your favorite posts!"
    : `Take a look at ${username}'s favorite posts!`;

  const favorites = [];

  return (
    <PDFListPage
      pageTitle={`${username}'s Favorites`}
      pageSubtitle={subtitle}
      items={favorites}
    />
  );
}
