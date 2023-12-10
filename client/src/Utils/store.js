import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.baseURL = "https://api-bulubulu.onrender.com/";

export function Login() {
  const { isLoading, isError, isSuccess, error, data, mutate } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("user/login", payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutate };
}

export function Register() {
  const { isLoading, isError, isSuccess, error, data, mutate } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("user/register", payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutate };
}

export function VetList() {
  const { isLoading, isError, isSuccess, error, data } = useQuery(["vetList"], async () => {
    const { data } = await axios.get("vet/list");
    return data;
  });

  return { isLoading, isError, isSuccess, error, data };
}

export function GetPicture(id) {
  const { isLoading, isError, isSuccess, error, data, refetch } = useQuery({
    queryKey: ["userPicture", id],
    queryFn: async () => {

      const { data } = await axios.get(`user/picture/${id}`, {
        responseType: "blob"
      });
      return data;
    }
  });

  return { isLoading, isError, isSuccess, error, data, refetch };
}

export function CreateSchedule() {
  const { isLoading, isError, isSuccess, error, data, mutate } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("schedule/create", payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutate };
}

export function UserScheduleList(id) {
  const { isLoading, isError, isSuccess, error, data, refetch } = useQuery(["userScheduleList", id], async () => {
    const { data } = await axios.get(`schedule/list/active/user/${id}`);
    return data;
  });

  return { isLoading, isError, isSuccess, error, data, refetch };
}

export function VetScheduleList(id) {
  const { isLoading, isError, isSuccess, error, data, refetch } = useQuery(["vetScheduleList", id], async () => {
    const { data } = await axios.get(`schedule/list/active/vet/${id}`);
    return data;
  });

  return { isLoading, isError, isSuccess, error, data, refetch };
}

export function GetDataChat({ userId, vetId }) {
  const { isLoading, isError, isSuccess, error, data } = useQuery(["GetChat", userId, vetId], async () => {
    const { data } = await axios.get(`chat/get/${userId}/${vetId}`);
    return data;
  });

  return { isLoading, isError, isSuccess, error, data };
}

export function GetRoomIdChat() {
  const { isLoading, isError, isSuccess, error, data } = useQuery(["GetRoomIdChat"], async () => {
    const { data } = await axios.get("chat/room-id");
    return data;
  });

  return { isLoading, isError, isSuccess, error, data };
}

export function VetListChat(id) {
  const { isLoading, isError, isSuccess, error, data, refetch } = useQuery(["VetListChat", id], async () => {
    const { data } = await axios.get(`chat/vet-list-chat/${id}`);
    return data;
  });

  return { isLoading, isError, isSuccess, error, data, refetch };
}

export function ChangeStatusSchedule() {
  const queryClient = useQueryClient()

  const { isLoading, isError, isSuccess, error, data, mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post("schedule/change-status", payload);
      return data;
    },
    onSuccess: () => {

      queryClient.invalidateQueries(['vetScheduleList'])
      queryClient.invalidateQueries(['userScheduleList'])
    }
  });

  return { isLoading, isError, isSuccess, error, data, mutateAsync };
}

export function UpdateProfileUser() {
  const { isLoading, isError, isSuccess, error, data, mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(`user/update/${payload.id}`, payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutateAsync };
}

export function UpdateProfilePicture() {
  const { isLoading, isError, isSuccess, error, data, mutateAsync } = useMutation({
    mutationFn: async (payload) => {

      const { data } = await axios.post(`user/update-photo/${payload.get('id')}`, payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutateAsync };
}

export function GetUserData(id) {
  const { isLoading, isError, isSuccess, error, data } = useQuery(["getUserData", id], async () => {
    const { data } = await axios.get(`user/get/${id}`);
    return data;
  });

  return { isLoading, isError, isSuccess, error, data };
}

export function Logout() {
  const { isLoading, isError, isSuccess, error, data, mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('user/logout', payload);
      return data;
    },
  });

  return { isLoading, isError, isSuccess, error, data, mutateAsync };
}