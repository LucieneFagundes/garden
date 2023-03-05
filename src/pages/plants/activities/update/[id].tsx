import { Formik, Form, Field } from "formik";
import Router from "next/router";
import { parseCookies } from "nookies";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Layout from "../../../../components/Layout";
import {
  getActivity,
  setUpdateActivity,
} from "../../../../services/activities-services";

interface Activity {
  id: string;
  activity: string;
  period: string;
  period_qd: number;
  initial_event: Date;
  next_event: Date;
}

export async function getServerSideProps(ctx?: any) {
  const { ["auth.token"]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const id = ctx.query.id;
  const data = await getActivity(id, ctx);

  return {
    props: { data },
  };
}

export default function UpdateActivity({ data }) {
  /*
    TODO: DATA E HORA: Tornar mais dinâmico a seleção de data e hora. É possível setar data e hora separado e juntar no envio para o back? 
   */
  const activity: Activity = data;

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPeriodQt, setSelectedPeriodQt] = useState(data.period_qd);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | undefined>(
    undefined
  );
  const toast = useRef(null);
  const activities = [
    { name: "Regar", key: "regar" },
    { name: "Fertilizar", key: "fertilizar" },
    { name: "Imersao", key: "imersao" },
    { name: "Umidificacao", key: "umidificacao" },
    { name: "Transplante", key: "transplante" },
  ];
  const period = [
    { name: "Dia", key: "dia" },
    { name: "Semana", key: "semana" },
    { name: "Mês", key: "mes" },
  ];

  //Date
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;

  let minDate = new Date();
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  //Formik
  const initialValues = {
    id: data.id,
    activity: "",
    period: "",
    period_qd: "",
    initial_event: "",
    notes: data.notes,
  };

  useEffect(() => {
    if (data.activity === "regar")
      setSelectedActivity({ name: "Regar", key: "regar" });
    if (data.activity === "fertilizar")
      setSelectedActivity({ name: "Fertilizar", key: "fertilizar" });
    if (data.activity === "imersao")
      setSelectedActivity({ name: "Imersao", key: "imersao" });
    if (data.activity === "umidificacao")
      setSelectedActivity({ name: "Umidificacao", key: "umidificacao" });
    if (data.activity === "transplante")
      setSelectedActivity({ name: "Transplante", key: "transplante" });

    if (data.period === "dia") setSelectedPeriod({ name: "Dia", key: "dia" });
    if (data.period === "semana")
      setSelectedPeriod({ name: "Semana", key: "semana" });
    if (data.period === "mes") setSelectedPeriod({ name: "Mês", key: "mes" });

    const convertDate = new Date(data.initial_event);
    setSelectedDate(convertDate);
  }, [data]);

  async function handleUpdateActivity(data: any) {
    try {
      data.activity = selectedActivity.key;
      data.period = selectedPeriod.key;
      data.initial_event = selectedDate;
      data.period_qd = selectedPeriodQt;

      await setUpdateActivity(data);
      Router.back();
    } catch (error) {
      showError(error.response.data.message);
    }
  }

  const showError = (message: string) => {
    toast.current.show({
      severity: "error",
      summary: "Algo deu errado",
      detail: message,
      life: 5000,
    });
  };

  return (
    <Layout title="Editar atividade">
      <Formik initialValues={initialValues} onSubmit={handleUpdateActivity}>
        <Form>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="activity">Atividade</label>
              <Dropdown
                className="w-full"
                id="activity"
                value={selectedActivity}
                options={activities}
                onChange={(e) => setSelectedActivity(e.value)}
                optionLabel="name"
                placeholder="Selecione a atividade"
              />
            </div>
            <div>
              <label htmlFor="periodo_qd">Repetição </label>
              <div className="flex flex-row justify-between items-center">
                <InputNumber
                  className="w-full"
                  inputId="periodo_qd"
                  value={selectedPeriodQt}
                  onValueChange={(e) => setSelectedPeriodQt(e.value)}
                  mode="decimal"
                  showButtons
                  min={1}
                  max={6}
                />
                <label htmlFor="period" className="w-36 text-center">
                  a cada
                </label>
                <Dropdown
                  className="w-full"
                  id="period"
                  value={selectedPeriod}
                  options={period}
                  onChange={(e) => setSelectedPeriod(e.value)}
                  optionLabel="name"
                  placeholder="Selecione o período"
                />
              </div>
            </div>
            <div>
              <label htmlFor="date">Data e hora de início</label>
              <Calendar
                className="w-full"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                showTime
                minDate={today}
                showIcon={true}
                dateFormat="dd/mm/yy"
              />
            </div>
            <div>
              <label htmlFor="notes">Anotações</label>
              <Field
                component="textarea"
                id="notes"
                name="notes"
                type="text"
                placeholder="Anotações"
                className="appearance-none relative block w-full px-3 py-2 mt-1 border
               border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm line"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full mt-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar tarefa
            </button>
          </div>
        </Form>
      </Formik>
      <Toast ref={toast} />
    </Layout>
  );
}
