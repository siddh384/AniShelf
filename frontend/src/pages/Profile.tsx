import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { fetchAvatarCharacters } from "@/lib/anilist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();

  const [avatars, setAvatars] = useState<any[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state once session loads
  useEffect(() => {
    if (session) {
      setName(session.user.name || "");
      setSelectedAvatar(session.user.image || "");
    }
  }, [session]);

  // Fetch Characters
  useEffect(() => {
    const getAvatars = async () => {
      const chars = await fetchAvatarCharacters();
      setAvatars(chars);
      setLoadingAvatars(false);
    };
    getAvatars();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      // Better Auth built-in update function!
      await authClient.updateUser({
        name: name,
        image: selectedAvatar,
      });
      toast.success("Profile updated successfully! ✨");
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setIsSaving(false);
  };

  if (isPending)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4f8ef5]" />
      </div>
    );
  if (!session)
    return (
      <div className="flex-1 flex items-center justify-center text-white">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="flex-1 bg-[#050c1a] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1
          className="text-4xl font-black text-white"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Profile Settings
        </h1>

        <div className="bg-[#0b1629] border border-[#1e3356] rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-12">
          {/* LEFT COLUMN: The Form */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label className="text-[#a8c8f0] font-semibold text-lg">
                Email Address
              </Label>
              <Input
                value={session.user.email}
                disabled
                className="bg-[#050c1a] border-[#1e3356] text-white/50 cursor-not-allowed h-12"
              />
              <p className="text-xs text-[#6b9fd4]">Email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#a8c8f0] font-semibold text-lg">
                Username
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#050c1a] border-[#1e3356] text-white focus-visible:ring-[#4f8ef5] h-12 text-lg"
                placeholder="Enter your username"
              />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#4f8ef5] hover:bg-[#3b7de9] text-white font-bold h-12 px-8"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button
                disabled
                variant="outline"
                className="border-[#1e3356] text-[#6b9fd4] hover:bg-[#1e3356] h-12"
              >
                Update Password
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Avatar Selection */}
          <div className="flex-1 space-y-4">
            <Label className="text-[#a8c8f0] font-semibold text-lg">
              Select Avatar (The Big 3)
            </Label>

            {/* Current Selected Preview */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#050c1a] rounded-xl border border-[#1e3356]">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="Current Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#4f8ef5]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#1e3356] flex items-center justify-center text-white text-xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-semibold">Current Avatar</p>
                <p className="text-sm text-[#6b9fd4]">Looks good!</p>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {loadingAvatars ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#4f8ef5]" />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {avatars.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => setSelectedAvatar(char.image.large)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-square ${selectedAvatar === char.image.large ? "border-[#4f8ef5] scale-95 shadow-[0_0_15px_rgba(79,142,245,0.5)]" : "border-transparent hover:border-[#1e3356]"}`}
                    >
                      <img
                        src={char.image.large}
                        alt={char.name.full}
                        className="w-full h-full object-cover"
                      />
                      {selectedAvatar === char.image.large && (
                        <div className="absolute inset-0 bg-[#4f8ef5]/20 flex items-center justify-center">
                          <CheckCircle2 className="text-white w-8 h-8 drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
