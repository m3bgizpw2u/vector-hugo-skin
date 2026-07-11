# `{{< election >}}`

Election infobox — replicates `Template:Infobox election` from
Wikipedia (~40k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/election.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The election title (becomes the infobox header); falls back to `election_name` then the page title. |
| `image` | optional | Map or ballot image filename. |
| `caption` | optional | Caption under the image; rendered through `markdownify`. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `country` | optional | Country where the election was held, e.g. `"United States"`. |
| `type` | optional | Election type, e.g. `"Presidential"`, `"Legislative"`, `"Local"`. |
| `ongoing` | optional | Set to render the row labelled "Status: Ongoing". |
| `previous_election` | optional | Title or year of the prior equivalent election. |
| `next_election` | optional | Title or year of the next equivalent election. |
| `seats_for_election` | optional | Total seats contested, e.g. `"435"`. |
| `majority_seats` | optional | Seats needed for a majority, e.g. `"218"`. |
| `election_date` | optional | Election date string, e.g. `"5 November 2024"`. |
| `turnout` | optional | Voter turnout, e.g. `"63.9%"`. |
| `registered` | optional | Registered-voter count; rendered as the "Registered" row. |
| `votes_for_election` | optional | Total votes cast; rendered as "Votes for election". |
| `needed_votes` | optional | Threshold for victory, rendered with a `" to win"` suffix. |
| `party_label` | optional | Custom column header, e.g. `"Candidate"`; defaults to `"Party"`. |
| `party_name` | optional | Convenience label for the candidate block heading. |
| `leader` | optional | First candidate group's leader name. |
| `party` | optional | First candidate group's party affiliation. |
| `candidate` | optional | First candidate group's candidate name. |
| `alliance` | optional | First candidate group's electoral alliance. |
| `last_election` | optional | First candidate group's seat count in the prior election. |
| `seats_won` | optional | First candidate group's seats won in this election. |
| `seats_before` | optional | First candidate group's seats before this election. |
| `popular_vote` | optional | First candidate group's popular-vote total. |
| `percentage` | optional | First candidate group's vote share, e.g. `"49.8%"`. |
| `swing` | optional | First candidate group's swing vs. previous election. |
| `results` | optional | Outcome summary row appended after the candidate blocks. |
| `leader2` | optional | Second candidate group's leader name. |
| `party2` | optional | Second candidate group's party affiliation. |
| `last_election2` | optional | Second candidate group's prior seat count. |
| `seats_won2` | optional | Second candidate group's seats won. |
| `seats_before2` | optional | Second candidate group's seats before. |
| `popular_vote2` | optional | Second candidate group's popular-vote total. |
| `percentage2` | optional | Second candidate group's vote share. |
| `swing2` | optional | Second candidate group's swing. |
| `before_election` | optional | Office-holder or seat count before the election. |
| `before_party` | optional | Party of the prior office-holder, parenthetically appended. |
| `after_election` | optional | Office-holder or seat count after the election. |
| `after_party` | optional | Party of the new office-holder, parenthetically appended. |
| `map_image` | optional | Map image filename (shown as a labelled "Map" row). |
| `map_caption` | optional | Caption used when `map_image` is present. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< election
    name            = "2024 United States presidential election"
    country         = "United States"
    type            = "Presidential"
    election_date   = "5 November 2024"
    turnout         = "63.9%"
    leader          = "Donald Trump"
    party           = "Republican"
    seats_won       = "312 electoral votes"
    percentage      = "49.8%"
>}}{{< /election >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_election>
- Demo article: [`exampleSite/content/articles/election-demo.md`](../../../exampleSite/content/articles/election-demo.md)