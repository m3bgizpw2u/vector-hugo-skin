import type { ShortcodeSpec } from "./types";

import { infobox } from "./primitives/infobox";
import { infoboxSection } from "./primitives/infobox-section";
import { infoboxRow } from "./primitives/infobox-row";
import { infoboxRowFull } from "./primitives/infobox-row-full";
import { infoboxRowImage } from "./primitives/infobox-row-image";
import { infoboxImage } from "./primitives/infobox-image";
import { infoboxSubheader } from "./primitives/infobox-subheader";
import { infoboxBelow } from "./primitives/infobox-below";
import { row } from "./primitives/row";
import { rowTable } from "./primitives/row-table";
import { quickRow } from "./primitives/quick-row";

import { person } from "./named/person";
import { footballBiography } from "./named/football-biography";
import { basketballBiography } from "./named/basketball-biography";
import { baseballBiography } from "./named/baseball-biography";
import { iceHockeyBiography } from "./named/ice-hockey-biography";
import { militaryPerson } from "./named/military-person";
import { settlement } from "./named/settlement";
import { country } from "./named/country";
import { protectedArea } from "./named/protected-area";
import { historicSite } from "./named/historic-site";
import { station } from "./named/station";
import { film } from "./named/film";
import { album } from "./named/album";
import { television } from "./named/television";
import { televisionEpisode } from "./named/television-episode";
import { televisionSeason } from "./named/television-season";
import { videoGame } from "./named/video-game";
import { award } from "./named/award";
import { software } from "./named/software";
import { company } from "./named/company";
import { organization } from "./named/organization";
import { school } from "./named/school";
import { university } from "./named/university";
import { church } from "./named/church";
import { politicalParty } from "./named/political-party";
import { footballClub } from "./named/football-club";
import { tennisTournamentEvent } from "./named/tennis-tournament-event";
import { election } from "./named/election";
import { militaryUnit } from "./named/military-unit";
import { militaryConflict } from "./named/military-conflict";

export const catalog: ShortcodeSpec[] = [
  infobox,
  infoboxSection,
  infoboxRow,
  infoboxRowFull,
  infoboxRowImage,
  infoboxImage,
  infoboxSubheader,
  infoboxBelow,
  row,
  rowTable,
  quickRow,
  person,
  footballBiography,
  basketballBiography,
  baseballBiography,
  iceHockeyBiography,
  militaryPerson,
  settlement,
  country,
  protectedArea,
  historicSite,
  station,
  film,
  album,
  television,
  televisionEpisode,
  televisionSeason,
  videoGame,
  award,
  software,
  company,
  organization,
  school,
  university,
  church,
  politicalParty,
  footballClub,
  tennisTournamentEvent,
  election,
  militaryUnit,
  militaryConflict,
];

export {
  album,
  award,
  baseballBiography,
  basketballBiography,
  church,
  company,
  country,
  election,
  film,
  footballBiography,
  footballClub,
  historicSite,
  iceHockeyBiography,
  infobox,
  infoboxBelow,
  infoboxImage,
  infoboxRow,
  infoboxRowFull,
  infoboxRowImage,
  infoboxSection,
  infoboxSubheader,
  militaryConflict,
  militaryPerson,
  militaryUnit,
  organization,
  person,
  politicalParty,
  protectedArea,
  row,
  rowTable,
  quickRow,
  school,
  settlement,
  software,
  station,
  television,
  televisionEpisode,
  televisionSeason,
  tennisTournamentEvent,
  university,
  videoGame,
};
