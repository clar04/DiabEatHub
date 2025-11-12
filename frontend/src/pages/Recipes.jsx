import SuggestedRecipesPanel from "../components/recipes/SuggestedRecipesPanel";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useProfile } from "../state/ProfileContext";
import { isProfileReady } from "../utils/ensureProfile";

export default function Recipes() {
  const { profile } = useProfile();

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold text-white">Suggested Recipes</h1>

        {!isProfileReady(profile) && (
          <Card className="mt-4 p-4 text-sm">
            Lengkapi data di <Link to="/profile" className="underline">Profile</Link> untuk saran yang lebih tepat.
          </Card>
        )}

        <div className="mt-6">
          <SuggestedRecipesPanel />
        </div>
      </div>
    </section>
  );
}
