import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { QuizDashboard } from "./components/QuizDashboard";

type UserProfile = "inspector" | "chef_etablissement" | null;

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleProfileSelect = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleBackToSelection = () => {
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">Quiz IA - Éducation</h2>
        {userProfile && (
          <button
            onClick={handleBackToSelection}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Changer de profil
          </button>
        )}
      </header>
      <main className="flex-1 p-4">
        {userProfile ? (
          <QuizDashboard 
            userProfile={userProfile} 
            sessionId={sessionId}
            onBackToSelection={handleBackToSelection}
          />
        ) : (
          <ProfileSelection onProfileSelect={handleProfileSelect} />
        )}
      </main>
      <Toaster />
    </div>
  );
}

function ProfileSelection({ onProfileSelect }: { onProfileSelect: (profile: UserProfile) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Quiz de Connaissances IA
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Testez vos connaissances sur l'Intelligence Artificielle dans l'éducation
        </p>
        <p className="text-gray-500">
          Sélectionnez votre profil pour accéder aux quiz adaptés
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Profil Inspecteur */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200"
             onClick={() => onProfileSelect("inspector")}>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Inspecteur</h3>
            <p className="text-gray-600 mb-6">
              Quiz spécialisés sur l'utilisation de l'IA dans l'inspection pédagogique, 
              l'analyse des pratiques d'enseignement et l'évaluation des établissements.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Thèmes abordés :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Analyse des données pédagogiques</li>
                <li>• Outils d'aide à l'inspection</li>
                <li>• Éthique et transparence</li>
                <li>• Accompagnement des équipes</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Accéder aux quiz Inspecteur
            </button>
          </div>
        </div>

        {/* Profil Chef d'Établissement */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-200"
             onClick={() => onProfileSelect("chef_etablissement")}>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chef d'Établissement</h3>
            <p className="text-gray-600 mb-6">
              Quiz dédiés à l'intégration de l'IA dans la gestion d'établissement, 
              l'optimisation des ressources et le pilotage pédagogique.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-900 mb-2">Thèmes abordés :</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Gestion des emplois du temps</li>
                <li>• Ressources humaines</li>
                <li>• Pilotage et indicateurs</li>
                <li>• Communication et relations</li>
              </ul>
            </div>
            <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Accéder aux quiz Chef d'Établissement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
