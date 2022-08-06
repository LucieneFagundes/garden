import { useState } from "react";
import Layout from "../../../../components/Layout";
import { Field, Form, Formik } from "formik";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { setActivity } from "../../../../services/activities-services";
import { parseCookies } from "nookies";
import { getPlantByIdRequest } from "../../../../services/plant-services";
import Router from "next/router";

export async function getServerSideProps(ctx: any) {
  const { ['auth.token']: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const id = ctx.query.id;

  return {
    props: { id }
  }
}
interface Props {
  id: string
}

export default function RegisterActivity({ id }: Props) {

  //PrimeReact
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedPeriodQt, setSelectedPeriodQt] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | undefined>(undefined);

  const activities = [
    { name: "Regar", key: "regar" },
    { name: "Fertilizar", key: "fertilizar" },
    { name: "Imersao", key: "imersao" },
    { name: "Umidificacao", key: "umidificacao" },
    { name: "Transplante", key: "transplante" },
  ]
  const period = [
    { name: "Dia", key: "dia" },
    { name: "Semana", key: "semana" },
    { name: "Mês", key: "mes" },
  ]

  //Date
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = (month === 0) ? 11 : month - 1;
  let prevYear = (prevMonth === 11) ? year - 1 : year;



  let minDate = new Date();
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);



  //Formik
  const initialValues = {
    plantId: id,
    activity: '',
    period: '',
    period_qd: '',
    initial_event: '',
    notes: '',
  }
  async function handleCreateActivity(data: any) {
    try {
      data.activity = selectedActivity.key;
      data.period = selectedPeriod.key;
      data.initial_event = selectedDate;
      data.period_qd = selectedPeriodQt;

      await setActivity(data)
      Router.back()
    } catch (err) {
      console.log(err);
    }
  }
 
  return (
    <Layout title="New Activity">
      <Formik initialValues={initialValues} onSubmit={handleCreateActivity}>
        <Form>

          <div   >
            <div>
              <label htmlFor="activity">Atividade</label>
              <Dropdown className="w-full" id="activity" value={selectedActivity} options={activities} onChange={(e) => setSelectedActivity(e.value)} optionLabel="name" placeholder="Selecione a atividade" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="periodo_qd">Repetição </label>
                <InputNumber className="w-full" inputId="periodo_qd" value={selectedPeriodQt} onValueChange={(e) => setSelectedPeriodQt(e.value)} mode="decimal" showButtons min={1} max={6} />
              </div>

              <div>
                <label htmlFor="period">Período</label>
                <Dropdown className="w-full" id="period" value={selectedPeriod} options={period} onChange={(e) => setSelectedPeriod(e.value)} optionLabel="name" placeholder="Selecione o período" />
              </div>
            </div>
            <div>
              <label htmlFor="date">Data e hora de início</label>
              <Calendar className="w-full" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} showTime minDate={today} showIcon={true} dateFormat="dd/mm/yy" />
            </div>
            <div>
              <label htmlFor="notes">Anotações</label>
              <Field component="textarea" id="notes"
                name="notes"
                type="text"
                placeholder="Anotações"
                className="appearance-none relative block w-full px-3 py-2 mt-1 border
                 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
            line"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar tarefa
            </button>
          </div>
        </Form>
      </Formik>
    </Layout>
  )
}