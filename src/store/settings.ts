import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

type State = {
    dentistId: string;
    patientId: string;
    serviceId: string;
    setDentistId: (v: string) => void;
    setPatientId: (v: string) => void;
    setServiceId: (v: string) => void;
    hydrate: () => void;
};

export const useSettingsStore = create<State>()(
    persist(
        (set, get) => ({
            dentistId: "",
            patientId: "",
            serviceId: "",
            setDentistId: (v) => set({dentistId: v}),
            setPatientId: (v) => set({patientId: v}),
            setServiceId: (v) => set({serviceId: v}),
            hydrate: () => void get().dentistId,
        }),
        {name: "settings", storage: createJSONStorage(() => localStorage)}
    )
);
