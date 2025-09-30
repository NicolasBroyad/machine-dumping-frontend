import React from "react";

export type PerfilType = {
  nombre: string;
  foto: string;
};

export function usePerfil() {
  const [perfil, setPerfil] = React.useState<PerfilType>({
    nombre: "Nombre y apellido",
    foto: "https://upload.wikimedia.org/wikipedia/en/7/73/Trollface.png",
  });

  const actualizarNombre = (nombre: string) => {
    setPerfil({ ...perfil, nombre });
  };

  const actualizarFoto = (foto: string) => {
    setPerfil({ ...perfil, foto });
  };

  return {
    perfil,
    actualizarNombre,
    actualizarFoto,
  };
}
