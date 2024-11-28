import { createAsyncThunk } from "@reduxjs/toolkit";
import { Login } from "../../Interfaces/LoginInterface";
import axios from "axios";
import { EncriptarDatos } from "../../security/Encriptar_data";
import { User } from "../../Interfaces/UserInterface";

// URL de la API
const { VITE_URL_API } = import.meta.env;

// Thunk para iniciar sesion
export const iniciarSesion = createAsyncThunk(
  "auth/iniciarSesion",
  async (dataRecibida: Login, { rejectWithValue }) => {
    try {
      const datosEncriptados = await EncriptarDatos(dataRecibida);
      const response = await axios.post(`${VITE_URL_API}/usuarios/login/`, {
        datos_encriptados: datosEncriptados,
      });
      return response.data?.data; // Devuelve los datos necesarios al estar logeado
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Error en la petición");
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para registrar a un usuario
export const registrarUsuario = createAsyncThunk(
  "userAction/registrarUsuario",
  async (dataRecibida: any, { rejectWithValue }) => {
    try {
      const datosEncriptados = await EncriptarDatos(dataRecibida);
      const response = await axios.post(`${VITE_URL_API}/usuarios/register/`, {
        datos_encriptados: datosEncriptados,
      });
      return response.data?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Error en la petición");
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para obtener y cargar la imagen de perfil del usuario
export const cargarImagenPerfil = createAsyncThunk(
  "auth/cargarImagenPerfil",
  async (user: User, { rejectWithValue }) => {
    try {
      if (!user || !user.url_prof_pic || !user.token) {
        return rejectWithValue("Faltan datos del usuario o del token");
      }

      // Construir la URL completa si comienza con "uploads/"
      let urlImagen = user.url_prof_pic;
      if (urlImagen.startsWith("uploads/")) {
        urlImagen = `${VITE_URL_API}/${urlImagen}`;
      }

      // Verificar que esta exista y no tenga null al final
      if (!urlImagen || urlImagen.endsWith("/null")) {
        return rejectWithValue("La URL de la imagen de perfil no es válida");
      }

      // Realizar la solicitud para cargar la imagen
      const response = await axios.get(urlImagen, {
        headers: {
          Authorization: `${user.token}`, // Token dado al loguearse
          "Content-Type": "application/json",
        },
        responseType: "blob", // Respuesta como Blob
      });

      // Crear un objeto Blob y devolver la URL local
      const url_img_blob = URL.createObjectURL(response.data);
      return url_img_blob;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "No se pudo cargar la imagen de perfil");
      }
      return rejectWithValue("Error desconocido");
    }
  }
);


// Thunk para obtener los datos del perfil del usuario
export const obtenerDatosDelPerfil = createAsyncThunk(
  "user/obtenerDatosDelPerfil",
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${VITE_URL_API}/usuarios/obtener-datos/${user.id_usuario}`, {
        headers: {
          Authorization: `${user.token}`, // Token dado al loguearse
          "Content-Type": "application/json",
        },
      });

      return response.data?.data?.userData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "No se pudo obtener los datos del perfil");
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para editar los datos del perfil del usuario (nickname)
export const editNickName = createAsyncThunk(
  "user/editNickName",
  async (user: User, { rejectWithValue }) => {

    try {
      const response = await axios.put(
        `${VITE_URL_API}/usuarios/edit-nick/`,
        {
          datos: {
            id_usuario: `${user.id_usuario}`,
            nick: user.nick,
          }
        },
        {
          headers: {
            Authorization: `${user.token}`, // Token dado al loguearse
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "No se pudo actualizar el nickname"
        );
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para editar los datos del perfil del usuario (dirección)
export const editAdressUser = createAsyncThunk(
  "user/editAdressUser",
  async (user: User, { rejectWithValue }) => {
    
    try {
      const response = await axios.put(
        `${VITE_URL_API}/usuarios/edit-direccion/`,
        {
          datos: {
            id_usuario: `${user.id_usuario}`,
            calle: `${user.calle}`,
            referencia: `${user.referencia}`,
            pais: `${user.pais}`,
            ciudad: `${user.ciudad}`,
            colonia: `${user.colonia}`,
            codigoPostal: `${user.codigoPostal}`
          }
        },
        {
          headers: {
            Authorization: `${user.token}`, // Token dado al loguearse
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "No se pudo actualizar la dirección"
        );
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para editar los datos del perfil del usuario (imagen de perfil)
export const editImgProfile = createAsyncThunk(
  "user/editImgProfile",
  async (user: User, { rejectWithValue }) => {

    try {
      const response = await axios.put(
        `${VITE_URL_API}/usuarios/edit-photo/`,
        {
          datos: {
            id_usuario: `${user.id_usuario}`,
            prof_pic: user.prof_pic,
          }
        },
        {
          headers: {
            Authorization: `${user.token}`, // Token dado al loguearse
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "No se pudo actualizar la imagen de perfil"
        );
      }
      return rejectWithValue("Error desconocido");
    }
  }
);

// Thunk para editar los datos del perfil del usuario (imagen de perfil)
export const deleteImgProfile = createAsyncThunk(
  "user/deleteImgProfile",
  async (user: User, { rejectWithValue }) => {

    try {
      const response = await axios.delete(`${VITE_URL_API}/usuarios/delete-photo`, {
        data: {
          datos: {
            id_usuario: `${user.id_usuario}`,
          },
        },
        headers: {
          Authorization: `${user.token}`,
        },
      });

      return response.data?.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "No se pudo borrar la imagen anterior"
        );
      }
      return rejectWithValue("Error desconocido");
    }
  }
);