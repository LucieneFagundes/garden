// import { parseCookies } from "nookies";
// import { createContext, ReactNode, useState } from "react";

// interface Props {
//   children: ReactNode
// }
// interface Plant {
//   photo: string;
//   name: string;
//   species: string;
//   notes: string;
// }


// interface IPlantProps {
//   plants: Plant[]
// }

// export const PlantContext = createContext({} as IPlantProps);

// export function PlantProvider({ children }: Props) {
//   const { 'auth.token': token } = parseCookies();
//   const [plants, setPlants] = useState([]);


//   return (

    
//     <PlantContext.Provider value={{ plants }}>
//       {children}
//     </PlantContext.Provider>
//   )
// }