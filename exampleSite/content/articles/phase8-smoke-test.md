---
title: "Phase 8 infobox smoke test"
date: 2026-07-10
draft: false
---

This fixture exercises every shipped named shortcode with at least the most-used
parameters. It exists so `hugo --source exampleSite` produces real `<aside
class="infobox">` output for each of the 30 wrappers. It is not a docs example;
it is a build-time smoke test.

## Settlement

{{< settlement
    name            = "Springfield"
    image           = "springfield.jpg"
    caption         = "Downtown Springfield"
    alt             = "Aerial view of downtown Springfield"
    country         = "United States"
    subdivision_type1 = "State"
    subdivision_name1 = "Illinois"
    coordinates     = "39.7817°N 89.6501°W"
    population_total = "114,738"
    population_as_of = "2020"
    area_total_km2  = "171.2"
    established_title1 = "Incorporated"
    established_date1 = "1832"
    leader_title    = "Mayor"
    leader_name     = "Misty Vela"
    timezone        = "CST"
    postal_code     = "62701"
    area_code       = "217"
    website         = "springfield.il.us" >}}{{< /settlement >}}

## Person

{{< person
    name          = "Ada Lovelace"
    image         = "ada.jpg"
    caption       = "Portrait of Ada Lovelace, 1843"
    alt           = "Black-and-white engraved portrait of a young woman"
    birth_date    = "10 December 1815"
    birth_place   = "London, England"
    death_date    = "27 November 1852"
    death_place   = "London, England"
    nationality   = "British"
    occupation    = "Mathematician, writer"
    notable_works = "*Notes on the Analytical Engine*"
    website       = "findingada.com" >}}{{< /person >}}

## Film

{{< film
    name        = "Inception"
    director    = "Christopher Nolan"
    producer    = "Emma Thomas, Christopher Nolan"
    writer      = "Christopher Nolan"
    starring    = "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
    music       = "Hans Zimmer"
    studio      = "Syncopy Films, Legendary Pictures"
    distributor = "Warner Bros. Pictures"
    released    = "8 July 2010"
    runtime     = "148"
    country     = "United States, United Kingdom"
    language    = "English"
    budget      = "160,000,000"
    gross       = "836,836,967"
    currency    = "USD" >}}{{< /film >}}

## Company

{{< company
    name           = "Acme Corporation"
    trade_name     = "Acme Co."
    type           = "Public"
    industry       = "Conglomerate"
    founded        = "1 January 1907"
    founder        = "R. J. Acme"
    hq_location    = "Springfield"
    hq_location_country = "United States"
    key_people     = "W. E. Coyote (CEO)"
    products       = "Anvils, rockets, road runners"
    revenue        = "US$1.2 billion"
    owner          = "Public shareholders"
    website        = "acme.example" >}}{{< /company >}}

## Software

{{< software
    name              = "Hugo"
    developer         = "spf13, Bjørn Erik Pedersen, and contributors"
    initial_release   = "2013"
    latest_release    = "0.163.3"
    latest_release_date = "2026-06-19"
    status            = "Active"
    operating_system  = "Cross-platform"
    platform          = "Linux, macOS, Windows, FreeBSD"
    license           = "Apache-2.0"
    source_model      = "Open-source"
    programming_language = "Go"
    website           = "gohugo.io" >}}{{< /software >}}

## Football biography

{{< football-biography
    name        = "Marta"
    full_name   = "Marta Vieira da Silva"
    birth_date  = "19 February 1986"
    birth_place = "Dois Riachos, Alagoas, Brazil"
    height      = "1.63"
    position    = "Forward"
    current_club = "Orlando Pride"
    years       = "2000–present"
    clubs       = "Vasco da Gama, Umeå, Santos, Golden Pride, Tyresö, FC Rosengård, Orlando Pride"
    nationalyears = "2002–present"
    nationalteam = "Brazil"
    nationalcaps = "179"
    nationalgoals = "115" >}}{{< /football-biography >}}

## Station

{{< station
    name        = "Waterloo"
    native_name = "London Waterloo"
    country     = "United Kingdom"
    coordinates = "51.5031°N 0.1132°W"
    line        = "South Western main line"
    connections = "Waterloo & City line, Jubilee line (via interchange)"
    platforms   = "22"
    tracks      = "24"
    opened      = "11 July 1848"
    code        = "WAT"
    operator    = "Network Rail" >}}{{< /station >}}

## Historic site (NRHP)

{{< historic-site
    name        = "Empire State Building"
    location    = "350 Fifth Avenue, Manhattan, New York City"
    coordinates = "40.7484°N 73.9857°W"
    built       = "1930–1931"
    architect   = "Shreve, Lamb and Harmon"
    architecture = "Art Deco"
    added       = "23 June 1986"
    NRHP_ref    = "86001256" >}}{{< /historic-site >}}

## Television

{{< television
    name             = "Severance"
    genre            = "Science fiction, thriller"
    creator          = "Dan Erickson"
    starring         = "Adam Scott, Britt Lower, Patricia Arquette"
    music            = "Teddy Shapiro"
    country_of_origin = "United States"
    num_seasons      = "2"
    num_episodes     = "19"
    network          = "Apple TV+"
    first_aired      = "18 February 2022"
    last_aired       = "present" >}}{{< /television >}}

## Military person

{{< military-person
    name          = "Patton"
    birth_date    = "11 November 1885"
    birth_place   = "San Gabriel, California, U.S."
    death_date    = "21 December 1945"
    death_place   = "Heidelberg, Germany"
    allegiance    = "United States"
    branch        = "United States Army"
    service_years = "1909–1945"
    rank          = "General"
    unit          = "Third Army"
    battles       = "World War I, World War II"
    awards        = "Distinguished Service Cross, Legion of Merit" >}}{{< /military-person >}}

## School

{{< school
    name        = "Springfield High School"
    motto       = "Veritas Lux in Tenebris"
    established = "1889"
    type        = "Public secondary"
    president   = "Jane Doe"
    principal   = "John Smith"
    students    = "2,100"
    grades      = "9–12"
    nickname    = "Tigers"
    mascot      = "Tommy Tiger"
    colors      = "Orange and black"
    website     = "springfieldhigh.example" >}}{{< /school >}}

## Video game

{{< video-game
    name      = "Hades"
    developer = "Supergiant Games"
    publisher = "Supergiant Games"
    director  = "Greg Kasavin"
    composer  = "Darren Korb"
    engine    = "Hades Engine"
    platform  = "Windows, macOS, Nintendo Switch, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S"
    initial_release_date = "17 September 2020"
    latest_release = "1.0"
    genre     = "Roguelike"
    modes     = "Single-player"
    status    = "Released" >}}{{< /video-game >}}

## University

{{< university
    name        = "Massachusetts Institute of Technology"
    motto       = "Mens et Manus"
    established = "1861"
    type        = "Private research university"
    endowment   = "US$24.6 billion"
    president   = "Sally Kornbluth"
    students    = "11,934"
    undergrad   = "4,547"
    postgrad    = "7,387"
    city        = "Cambridge"
    state       = "Massachusetts"
    country     = "United States"
    colors      = "Cardinal red and silver gray"
    mascot      = "Tim the Beaver"
    nickname    = "MIT"
    website     = "mit.edu" >}}{{< /university >}}

## Military unit

{{< military-unit
    name        = "101st Airborne Division"
    start_date  = "15 August 1942"
    country     = "United States"
    allegiance  = "United States"
    branch      = "United States Army"
    type        = "Airborne infantry"
    role        = "Air assault"
    garrison    = "Fort Campbell, Kentucky"
    nickname    = "Screaming Eagles"
    motto       = "Rendezvous with Destiny"
    commander   = "Major General Andrew C. Hilmes" >}}{{< /military-unit >}}

## Basketball biography

{{< basketball-biography
    name        = "Lisa Leslie"
    birth_date  = "7 July 1972"
    birth_place = "Gardena, California, U.S."
    nationality = "American"
    height      = "1.96"
    position    = "Center"
    college     = "USC"
    draft_year  = "1997"
    draft_round = "1"
    draft_pick  = "7"
    draft_team  = "Los Angeles Sparks"
    career_start = "1997"
    career_end  = "2009"
    hall_of_fame = "Inducted 2015" >}}{{< /basketball-biography >}}

## Baseball biography

{{< baseball-biography
    name      = "Babe Ruth"
    birth_date = "6 February 1895"
    birth_place = "Baltimore, Maryland, U.S."
    bats      = "Left"
    throws    = "Left"
    debut     = "11 July 1914"
    final_game = "30 May 1935"
    position  = "Outfielder, pitcher"
    team      = "New York Yankees"
    teams     = "Boston Red Sox, New York Yankees, Boston Braves"
    hall_of_fame = "Inducted 1936" >}}{{< /baseball-biography >}}

## Football club

{{< football-club
    name        = "Manchester United"
    full_name   = "Manchester United Football Club"
    nickname    = "The Red Devils"
    founded     = "1878"
    ground      = "Old Trafford"
    capacity    = "74,310"
    owner       = "TBD (Glazers exploring sale)"
    chairman    = "Joel Glazer, Avram Glazer"
    manager     = "Erik ten Hag"
    league      = "Premier League"
    season      = "2024–25"
    website     = "manutd.com" >}}{{< /football-club >}}

## Ice hockey biography

{{< ice-hockey-biography
    name        = "Connor McDavid"
    birth_date  = "13 January 1997"
    birth_place = "Richmond Hill, Ontario, Canada"
    height      = "188"
    weight      = "88"
    position    = "Center"
    shoots      = "Left"
    played_for  = "Erie Otters, Edmonton Oilers"
    national_team = "Canada"
    draft_year  = "2015"
    draft_round = "1"
    draft_pick  = "1"
    draft_team  = "Edmonton Oilers"
    career_start = "2015" >}}{{< /ice-hockey-biography >}}

## Military conflict

{{< military-conflict
    name        = "Battle of Gettysburg"
    part_of     = "American Civil War"
    date_start  = "1 July 1863"
    date_end    = "3 July 1863"
    place       = "Gettysburg, Pennsylvania, United States"
    result      = "Union victory"
    combatant1  = "United States (Union)"
    combatant2  = "Confederate States"
    commander1  = "George G. Meade"
    commander2  = "Robert E. Lee"
    casualties1 = "23,049"
    casualties2 = "28,063" >}}{{< /military-conflict >}}

## Tennis tournament event

{{< tennis-tournament-event
    name      = "2024 Wimbledon Championships – Men's singles"
    tournament = "Wimbledon Championships"
    tour      = "Grand Slam"
    draw      = "128S / 64Q"
    surface   = "Grass"
    location  = "Wimbledon, London"
    venue     = "All England Lawn Tennis and Croquet Club"
    date      = "1–14 July 2024"
    champ_name = "Carlos Alcaraz"
    runner_name = "Novak Djokovic"
    score     = "6–2, 6–2, 7–6(7–4)"
    prize_money = "£2,700,000" >}}{{< /tennis-tournament-event >}}

## Organization

{{< organization
    name           = "Wikimedia Foundation"
    logo           = "wikimedia-logo.svg"
    type           = "501(c)(3) nonprofit"
    founded        = "20 June 2003"
    founder        = "Jimmy Wales"
    hq_location    = "San Francisco, California"
    hq_location_country = "United States"
    area_served    = "Worldwide"
    employees      = "700+"
    key_people     = "Maryana Iskander (CEO)"
    website        = "wikimediafoundation.org" >}}{{< /organization >}}

## Award

{{< award
    name          = "Academy Award for Best Picture"
    awarded_for   = "Excellence in cinematic achievements"
    presenter     = "Academy of Motion Picture Arts and Sciences"
    country       = "United States"
    established   = "16 May 1929"
    first_awarded = "1929"
    website       = "oscars.org" >}}{{< /award >}}

## Television episode

{{< television-episode
    name        = "Ozymandias"
    series      = "Breaking Bad"
    season      = "5"
    episode     = "14"
    director    = "Rian Johnson"
    writer      = "Moira Walley-Beckett"
    starring    = "Bryan Cranston, Anna Gunn, Aaron Paul"
    airdate     = "15 September 2013"
    production_code = "S05E14"
    runtime     = "47"
    network     = "AMC" >}}{{< /television-episode >}}

## Church

{{< church
    name        = "St. Patrick's Cathedral"
    dedication  = "Saint Patrick"
    denomination = "Catholic (Roman)"
    location    = "New York City"
    country     = "United States"
    coordinates = "40.7587°N 73.9757°W"
    architecture_style = "Gothic Revival"
    founded     = "1809"
    completed   = "1878"
    capacity    = "2,400"
    length      = "120 m"
    website     = "stpatrickscathedral.org" >}}{{< /church >}}

## Television season

{{< television-season
    name         = "Breaking Bad — Season 5"
    series_name  = "Breaking Bad"
    season_number = "5"
    num_episodes = "16"
    network      = "AMC"
    first_aired  = "15 July 2012"
    last_aired   = "29 September 2013" >}}{{< /television-season >}}

## Political party

{{< political-party
    name        = "Green Party of England and Wales"
    abbreviation = "GPEW"
    leader      = "Co-leaders"
    founded     = "1990"
    headquarters = "London"
    country     = "United Kingdom"
    ideology    = "Green politics, eco-socialism"
    position    = "Left-wing"
    colors      = "Green"
    seats1      = "1 (House of Commons)"
    seats2      = "Various regional"
    website     = "greenparty.org.uk" >}}{{< /political-party >}}

## Protected area

{{< protected-area
    name        = "Yellowstone National Park"
    location    = "Wyoming, Montana, Idaho"
    coordinates = "44.4280°N 110.5885°W"
    area        = "2,219,791 acres (8,987 km²)"
    established = "1 March 1872"
    governing_body = "U.S. National Park Service"
    iucn_category = "II (national park)"
    designation = "National park, World Heritage Site"
    world_heritage_site = "Yes (1978)" >}}{{< /protected-area >}}

## Election

{{< election
    name            = "2024 United States presidential election"
    country         = "United States"
    type            = "Presidential"
    previous_election = "2020"
    next_election   = "2028"
    election_date   = "5 November 2024"
    turnout         = "63.9%"
    party           = "Republican"
    leader          = "Donald Trump"
    last_election   = "2020 (lost)"
    seats_won       = "312 electoral votes"
    popular_vote    = "77,303,573"
    percentage      = "49.8%"
    swing           = "+1.2%"
    party2          = "Democratic"
    leader2         = "Kamala Harris"
    seats_won2      = "226 electoral votes" >}}{{< /election >}}

## Country

{{< country
    name               = "France"
    native_name        = "République française"
    motto              = "Liberté, Égalité, Fraternité"
    anthem             = "La Marseillaise"
    capital            = "Paris"
    largest_city       = "Paris"
    official_languages = "French"
    demonym            = "French"
    government         = "Unitary semi-presidential republic"
    leader_title1      = "President"
    leader_name1       = "Emmanuel Macron"
    leader_title2      = "Prime Minister"
    leader_name2       = "Michel Barnier"
    sovereignty_type   = "Republic"
    established_event1 = "French Revolution"
    established_date1  = "1789"
    area_km2           = "643,801"
    area_rank          = "42nd"
    percent_water      = "0.26"
    population_estimate = "68,070,000"
    population_estimate_rank = "21st"
    population_census   = "67,391,582 (2022)"
    population_density_km2 = "119"
    GDP_PPP            = "$3.7 trillion"
    GDP_PPP_year       = "2024"
    GDP_nominal        = "$3.1 trillion"
    GDP_nominal_year   = "2024"
    GDP_nominal_rank   = "7th"
    HDI                = "0.920"
    HDI_year           = "2022"
    currency           = "Euro (€) (EUR)"
    timezone           = "UTC+1 (CET); summer UTC+2 (CEST)"
    drives_on          = "Right"
    calling_code       = "+33"
    website            = "gouvernement.fr" >}}{{< /country >}}

## Album

{{< album
    name      = "OK Computer"
    type      = "Studio"
    artist    = "Radiohead"
    released  = "21 May 1997"
    recorded  = "1996–1997"
    studio    = "St Catherine's Court, Bath; Abbey Road Studios, London"
    genre     = "Art rock, alternative rock, electronica"
    length    = "53:30"
    label     = "Parlophone, Capitol"
    producer  = "Nigel Godrich, Radiohead"
    tracks    = "12" >}}{{< /album >}}