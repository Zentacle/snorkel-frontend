import Location from 'models/Location';

const isBigIsland = (area: Location, area_two?: string) => (
  area.short_name == 'big-island' || area_two == 'big-island'
)

const isMaui = (area: Location, area_two?: string) => (
  area.short_name == 'maui' || area_two == 'maui'
)

const isOahu = (area: Location, area_two?: string) => (
  area.short_name == 'oahu' || area_two == 'oahu'
)

const isNY = (area: Location, area_one?: string) => (
  area.short_name == 'ny' || area_one == 'ny'
)

const isNJ = (area: Location, area_one?: string) => (
  area.short_name == 'nj' || area_one == 'nj'
)

export default (area: Location, area_one?: string, area_two?: string) =>
  isMaui(area, area_two)
  || isBigIsland(area, area_two)
  || isOahu(area, area_two)
  || isNY(area, area_one)
  || isNJ(area, area_one);
