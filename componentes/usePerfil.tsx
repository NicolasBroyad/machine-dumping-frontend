import React from "react";

export type PerfilType = {
  name: string;
  picture: string;
};

export function usePerfil() {
  const [profile, setProfile] = React.useState<PerfilType>({
    name: "Nombre y apellido",
    picture: "https://upload.wikimedia.org/wikipedia/en/7/73/Trollface.png",
  });

  const updateName = (name: string) => {
    setProfile({ ...profile, name });
  };

  const updatePicture = (picture: string) => {
    setProfile({ ...profile, picture });
  };

  return {
    profile,
    updateName,
    updatePicture,
  };
}
