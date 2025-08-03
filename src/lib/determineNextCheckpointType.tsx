import { RootState } from "../store";
import { Checkpoint } from "../store/types/checkpoint";

export const determineNextCheckpointType = (
  locationId: string,
  id: string | undefined,
  getState: () => RootState,
  serverCheckpoints?: Checkpoint[],
): "ENTER" | "EXIT" => {
  try {
    // Получаем данные из Redux
    const { checkpoints = [] } = getState().local;

    // Фильтруем чекпоинты
    const filteredCheckpoints = [
      ...checkpoints.filter(c =>
        c.locationId === locationId &&
        c.vehicleId === id || c.locationId === locationId &&
        c.userId === id
      ),
      ...(serverCheckpoints || []).filter(c =>
        c.locationId === locationId &&
        c.vehicleId === id || c.locationId === locationId &&
        c.userId === id
      )
    ];

    // Если нет чекпоинтов - начинаем с ENTER
    if (filteredCheckpoints.length === 0) return "ENTER";

    // Находим последний чекпоинт
    const lastCheckpoint = filteredCheckpoints.reduce((latest, current) =>
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    // Возвращаем противоположный тип
    return lastCheckpoint.type === "ENTER" ? "EXIT" : "ENTER";

  } catch (error) {
    console.error("Checkpoint type error:", error);
    return "ENTER"; // Fallback
  }
};