import React, { useState } from 'react';
import { CalendarEvent, MipLogEntry, CalendarSubMenu } from '../types';
import { Calendar as CalendarIcon, CheckSquare, Plus, Clock, Trash2, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CalendarViewProps {
  subCategory: CalendarSubMenu;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  mipLogs: MipLogEntry[];
  setMipLogs: React.Dispatch<React.SetStateAction<MipLogEntry[]>>;
  isAdmin: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  subCategory,
  events,
  setEvents,
  mipLogs,
  setMipLogs,
  isAdmin,
}) => {
  // Current calendar view month state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(todayStr);
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('Adubação');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [newEventDosage, setNewEventDosage] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  // New MIP Log Form State
  const [newMipZone, setNewMipZone] = useState('Estufa Principal');
  const [newMipPest, setNewMipPest] = useState('Ácaro do Teto');
  const [newMipSeverity, setNewMipSeverity] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [newMipAction, setNewMipAction] = useState('Aplicação de Beauveria bassiana + JWA');
  const [newMipResp, setNewMipResp] = useState('Equipe ASTRAYA');
  const [showAddMip, setShowAddMip] = useState(false);

  // Month navigation
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Calendar Grid calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Helper to format date string YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Filter events and logs for the selected date
  const selectedDayEvents = events.filter((e) => e.date === selectedDate);
  const selectedDayMipLogs = mipLogs.filter((m) => m.date === selectedDate);

  // Handlers for Events
  const handleToggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;
    const item: CalendarEvent = {
      id: 'ev-' + Date.now(),
      title: newEventTitle,
      date: newEventDate,
      type: newEventType,
      notes: newEventNotes,
      dosageOrVolume: newEventDosage,
      completed: false,
    };
    setEvents([item, ...events]);
    setNewEventTitle('');
    setNewEventNotes('');
    setNewEventDosage('');
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for MIP Logs
  const handleAddMipLog = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MipLogEntry = {
      id: 'mip-' + Date.now(),
      date: newEventDate,
      zone: newMipZone,
      pestObserved: newMipPest,
      severityLevel: newMipSeverity,
      actionTaken: newMipAction,
      responsible: newMipResp,
    };
    setMipLogs([item, ...mipLogs]);
    setShowAddMip(false);
  };

  const handleDeleteMipLog = (id: string) => {
    setMipLogs((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-emerald-300 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100">
                {subCategory === 'manutencao'
                  ? '2.1 Agendamento e Manutenção do Cultivo'
                  : '2.2 MIP - Registro & Histórico de Pragas'}
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Clique nos dias do calendário abaixo para visualizar os registros detalhados da data.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setNewEventDate(selectedDate);
              subCategory === 'manutencao'
                ? setShowAddEvent(!showAddEvent)
                : setShowAddMip(!showAddMip);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{subCategory === 'manutencao' ? 'Nova Tarefa' : 'Novo Registro MIP'}</span>
          </button>
        </div>
      </div>

      {/* MONTHLY CALENDAR GRID WIDGET */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        {/* Calendar Header Month Control */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{monthNames[month]} {year}</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentMonthDate(new Date());
                setSelectedDate(todayStr);
              }}
              className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-lg hover:bg-emerald-900 transition"
            >
              Hoje
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-2">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-12 bg-slate-950/40 rounded-xl opacity-30" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = formatDateStr(year, month, dayNum);
            const isSelected = dayStr === selectedDate;
            const isToday = dayStr === todayStr;

            // Check if there are events or mip logs on this day
            const dayEvs = events.filter((e) => e.date === dayStr);
            const dayMips = mipLogs.filter((m) => m.date === dayStr);
            const totalCount = subCategory === 'manutencao' ? dayEvs.length : dayMips.length;

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDate(dayStr)}
                className={`h-12 p-1 rounded-xl flex flex-col justify-between transition relative border text-left ${
                  isSelected
                    ? 'bg-emerald-900/80 border-emerald-400 ring-2 ring-emerald-400/30 text-white font-bold'
                    : isToday
                    ? 'bg-slate-800 border-emerald-600/80 text-emerald-300 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">{dayNum}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>

                {/* Event indicators */}
                {totalCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500 text-slate-950">
                      {totalCount} {totalCount === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DATE DETAILS PANEL */}
      <div className="bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>Registros do Dia: <span className="text-emerald-300 font-mono">{selectedDate}</span></span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exibindo atividades agendadas e relatórios registrados para esta data.
            </p>
          </div>

          <button
            onClick={() => {
              setNewEventDate(selectedDate);
              subCategory === 'manutencao' ? setShowAddEvent(true) : setShowAddMip(true);
            }}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-xs font-bold rounded-xl transition border border-emerald-600/50"
          >
            + Adicionar para {selectedDate}
          </button>
        </div>

        {/* SUB-SECTION 2.1: MANUTENÇÃO DO CULTIVO (SELECTED DAY) */}
        {subCategory === 'manutencao' && (
          <div className="space-y-4">
            {/* Add Event Form Modal / Expand */}
            {showAddEvent && (
              <form
                onSubmit={handleAddEvent}
                className="bg-slate-950 border border-emerald-600/80 rounded-2xl p-4 text-xs space-y-3 shadow-lg"
              >
                <h4 className="font-bold text-sm text-emerald-400">Agendar Tarefa para {newEventDate}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Título da Tarefa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rega com FAA 1:1000 + Cal-Mag"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Data da Operação</label>
                    <input
                      type="date"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Tipo de Atividade</label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as CalendarEvent['type'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Rega">Rega / Água</option>
                      <option value="Adubação">Adubação / Fertirrigação</option>
                      <option value="Poda">Poda / LST / Defolha</option>
                      <option value="MIP_Aplicacao">Aplicação MIP</option>
                      <option value="Muda_Estagio">Mudança de Estágio (Luz 18/6 / 12/12)</option>
                      <option value="Manutencao">Manutenção Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Dosagem / Volume (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: 5 Litros por vaso (EC 1.4 / pH 6.2)"
                      value={newEventDosage}
                      onChange={(e) => setNewEventDosage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Observações Técnicas</label>
                  <textarea
                    rows={2}
                    placeholder="Anotações para a equipe de campo..."
                    value={newEventNotes}
                    onChange={(e) => setNewEventNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shadow"
                  >
                    Salvar Agendamento
                  </button>
                </div>
              </form>
            )}

            {/* Selected Day Agenda List */}
            <div className="space-y-3">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-6 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <p>Nenhuma atividade cadastrada para {selectedDate}.</p>
                  <button
                    onClick={() => {
                      setNewEventDate(selectedDate);
                      setShowAddEvent(true);
                    }}
                    className="mt-2 text-emerald-400 hover:underline font-bold"
                  >
                    + Criar nova atividade nesta data
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.completed
                        ? 'bg-slate-950/60 border-slate-800 opacity-70'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleEvent(item.id)}
                          className={`mt-0.5 p-1 rounded-lg border transition ${
                            item.completed
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`font-bold text-sm ${
                                item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                              {item.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1 font-medium text-emerald-300">
                              <Clock className="w-3.5 h-3.5" />
                              {item.date}
                            </span>
                            {item.dosageOrVolume && (
                              <span className="text-amber-300 font-semibold">{item.dosageOrVolume}</span>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-xs text-slate-300 mt-1.5 italic bg-slate-900 p-2 rounded-lg border border-slate-800">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUB-SECTION 2.2: REGISTRO MIP (SELECTED DAY) */}
        {subCategory === 'mip_log' && (
          <div className="space-y-4">
            {/* Add MIP Log Modal / Expand */}
            {showAddMip && (
              <form
                onSubmit={handleAddMipLog}
                className="bg-slate-950 border border-emerald-600/80 rounded-2xl p-4 text-xs space-y-3 shadow-lg"
              >
                <h4 className="font-bold text-sm text-emerald-400">Registrar Inspeção MIP para {newEventDate}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Setor / Zona de Cultivo</label>
                    <input
                      type="text"
                      required
                      value={newMipZone}
                      onChange={(e) => setNewMipZone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Praga / Enfermidade Observada</label>
                    <input
                      type="text"
                      required
                      value={newMipPest}
                      onChange={(e) => setNewMipPest(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Grau de Severidade (1 a 5)</label>
                    <select
                      value={newMipSeverity}
                      onChange={(e) => setNewMipSeverity(Number(e.target.value) as 1|2|3|4|5)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 - Leve / Poucos indivíduos isolados</option>
                      <option value={2}>2 - Moderado Leve / Foco inicial localizado</option>
                      <option value={3}>3 - Moderado / Espalhado em várias plantas</option>
                      <option value={4}>4 - Severo / Danos visíveis na folhagem</option>
                      <option value={5}>5 - Infestação Crítica / Risco às flores</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Responsável pela Inspeção</label>
                    <input
                      type="text"
                      required
                      value={newMipResp}
                      onChange={(e) => setNewMipResp(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ação Corretiva APLICADA</label>
                  <textarea
                    rows={2}
                    required
                    value={newMipAction}
                    onChange={(e) => setNewMipAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddMip(false)}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shadow"
                  >
                    Salvar Registro MIP
                  </button>
                </div>
              </form>
            )}

            {/* Selected Day MIP Logs List */}
            <div className="space-y-3">
              {selectedDayMipLogs.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-6 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <p>Nenhum registro de praga ou inspeção MIP em {selectedDate}.</p>
                  <button
                    onClick={() => {
                      setNewEventDate(selectedDate);
                      setShowAddMip(true);
                    }}
                    className="mt-2 text-emerald-400 hover:underline font-bold"
                  >
                    + Registrar inspeção MIP nesta data
                  </button>
                </div>
              ) : (
                selectedDayMipLogs.map((log) => {
                  const sevColor =
                    log.severityLevel >= 4
                      ? 'bg-rose-950 border-rose-800 text-rose-300'
                      : log.severityLevel >= 3
                      ? 'bg-amber-950 border-amber-800 text-amber-300'
                      : 'bg-emerald-950 border-emerald-800 text-emerald-300';

                  return (
                    <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-100">{log.zone}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sevColor}`}>
                              Severidade: Nível {log.severityLevel}/5
                            </span>
                          </div>
                          <p className="text-xs text-amber-300 font-semibold mt-0.5">
                            Praga: {log.pestObserved}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteMipLog(log.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                        <span className="text-emerald-400 font-bold block">Ação do Manejo Integrado:</span>
                        <p className="text-slate-200">{log.actionTaken}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Data: {log.date}</span>
                        <span>Técnico Responsável: {log.responsible}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
