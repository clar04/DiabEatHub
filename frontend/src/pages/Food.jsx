import FoodCheckPanel from "../components/food/FoodCheckPanel";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useProfile } from "../state/ProfileContext";
import { isProfileReady } from "../utils/ensureProfile";

export default function Food() {
  const { profile } = useProfile();

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold text-white">Food Check</h1>

        {!isProfileReady(profile) && (
          <Card className="mt-4 p-4 text-sm">
            Lengkapi data di halaman <Link to="/profile" className="underline">Profile</Link> agar rekomendasi akurat.
          </Card>
        )}

        <div className="mt-6">
          <FoodCheckPanel />
        </div>
      </div>
    </section>
  );
}
