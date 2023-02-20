import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import isAfter from "date-fns/isAfter";
import ptBR from "date-fns/locale/pt-BR";
import { parseCookies } from "nookies";
import { Fragment, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { setNextEvent } from "../services/activities-services";
import { getPlantsWithActivities } from "../services/plant-services";
import noImage from "../public/noImage.png";
import Image from "next/image";

interface IActivity {
  id: string;
  activity: string;
  notes: string;
  initial_event: string;
  next_event: string;
  plantId: string;
  plant: {
    name: string;
    photo?: any;
  };
}
//TODO: AO CLICAR EM EDITAR, REDIRECIONAR PARA A PLANTA

export async function getServerSideProps(ctx: any) {
  const { ["auth.token"]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { id } = JSON.parse(token);
  const data = await getPlantsWithActivities(id, ctx);

  return {
    props: { data, userId: id },
  };
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar({ data, userId }: any) {
  const dataTasks: IActivity[] = Array.from(data);
  const [tasks, setTasks] = useState<IActivity[]>(dataTasks);

  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayMeetings = tasks?.filter((meeting) =>
    isSameDay(parseISO(meeting.next_event), selectedDay)
  );

  async function upEvent(data) {
    try {
      await setNextEvent(data.id);
      const res = await getPlantsWithActivities(userId);
      setTasks(res);
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Layout title="Agenda">
      <div className="pt-16">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-gray-900 capitalize">
                  {format(firstDayCurrentMonth, "MMMM yyyy", { locale: ptBR })}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                <div>D</div>
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      "py-1.5"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "text-red-500",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-900",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-400",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-red-500",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-gray-900",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>

                    <div className="w-4 h-1 mx-auto mt-1">
                      {tasks?.some(
                        (meeting) =>
                          isSameDay(parseISO(meeting.next_event), day) &&
                          isAfter(parseISO(meeting.next_event), today)
                      ) && <div className="w-4 h-1 bg-sky-500"></div>}
                      {tasks?.some(
                        (meeting) =>
                          isSameDay(parseISO(meeting.next_event), day) &&
                          !isAfter(parseISO(meeting.next_event), today)
                      ) && <div className="w-4 h-1 bg-red-500"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                Agenda para{" "}
                <time
                  dateTime={format(selectedDay, "yyyy-MM-dd", { locale: ptBR })}
                >
                  {format(selectedDay, "dd MMM, yyyy", { locale: ptBR })}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayMeetings.length > 0 ? (
                  selectedDayMeetings.map((tasks) => (
                    <Meeting
                      meeting={tasks}
                      key={tasks.id}
                      handleEvent={upEvent}
                    />
                  ))
                ) : (
                  <p>Sem tarefas hoje.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Meeting({ meeting, handleEvent }) {
  let startDateTime = parseISO(meeting.next_event);
  let endDateTime = parseISO(meeting.next_event);

  return (
    <li
      className={
        (classNames(isAfter(parseISO(meeting.next_event), startOfToday())) &&
          "flex items-center bg-green-100 px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-green-200") ||
        (!isAfter(parseISO(meeting.next_event), startOfToday()) &&
          "flex items-center px-4 py-2 space-x-4 bg-red-100 group rounded-xl focus-within:bg-gray-100 hover:bg-red-200")
      }
    >
      <Image
        src={meeting.plant.photo ? meeting.plant.photo : noImage}
        width="70"
        height="70"
        alt=""
        className="flex-none w-3 h-3 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900 capitalize">
          {meeting.activity} - {meeting.plant.name}
        </p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, "HH:mm ")}
          </time>{" "}
          {/* -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, "h:mm a")}
          </time> */}
        </p>
      </div>
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleEvent(meeting)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full m-0 text-start"
                    )}
                  >
                    Concluir
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Editar
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Cancelar
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
