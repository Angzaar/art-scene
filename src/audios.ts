import { AudioStream, AvatarAnchorPointType, AvatarAttach, engine, Entity, Transform } from "@dcl/sdk/ecs";
import { utils } from "./helpers/libraries";
import { shops } from "./shops";
import { isPreview } from "./helpers/functions";
import { Vector3 } from "@dcl/sdk/math";

interface TrackInfo {
    id: string;
    title: string;
    artist: string;
    duration: number;
    streamUrl: string;
    artworkUrl: string;
}

let trackInterval:any
let storePlaylistLoaded: Map<number, boolean> = new Map(); // Store ID → Loaded Status
let storeElapsedTime: Map<number, number> = new Map(); // Store ID → Seconds elapsed
let trackStartTimestamp: number | null = null; // When the track started playing (in UNIX time)
let storeTrackLists: Map<number, TrackInfo[]> = new Map(); // Store ID → Tracks
let storeCurrentTrackIndex: Map<number, number> = new Map(); // Store ID → Track index
let storeResumeTime: Map<number, number> = new Map(); // Store ID → Resume time (seconds)
let storeIsPaused: Map<number, boolean> = new Map(); // Store ID → Is paused?
let currentStoreId: number = -1; // Tracks the store the player is currently in
let audiusHost: string | null = null; // Store the selected host

let shopAudioEntity:Entity

async function selectAudiusHost() {
    if(isPreview){
        audiusHost = "https://audius-dn1.tikilabs.com"
        return
    }

    try {
        const response = await fetch("https://api.audius.co");
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            audiusHost = data.data[0]; // Select the first available host
            console.log(`Selected Audius Host: ${audiusHost}`);
        } else {
            console.error("No Audius hosts available.");
        }
    } catch (error) {
        console.error("Error selecting Audius host:", error);
    }
}

export function extractPlaylistPermalink(url: string): string | null {
    const match = url.match(/audius\.co\/([^/]+\/playlist\/[^/]+)/);
    return match ? `/${match[1]}` : null;
}

function extractPlaylistName(url: string): string | null {
    const parts = url.split("/");
    if (parts.length < 2) return null; // Invalid URL

    let lastSegment = parts[parts.length - 1]; // Get the last part
    // lastSegment = decodeURIComponent(lastSegment.replace(/-\d+$/, "")); // Remove trailing numbers

    return lastSegment;
}

async function searchPlaylist(playlistPermalink: string, playlistQuery:string): Promise<string | null> {
    console.log('serarching playlist', encodeURIComponent(playlistPermalink))
    try {
        const response = await fetch(`${audiusHost}/v1/playlists/search?query=${playlistQuery}`);
        const data = await response.json();

        console.log('search result is', data)

        if (!data || !data.data) return null;

        // Find the playlist that has the exact permalink
        const matchingPlaylist = data.data.find((playlist: any) =>
            playlist.permalink === playlistPermalink
        );

        return matchingPlaylist ? matchingPlaylist.id : null;
    } catch (error) {
        console.error("Error searching for playlist:", error);
        return null;
    }
}

async function fetchPlaylistTracks(playlistId: string): Promise<TrackInfo[]> {
    try {
        const response = await fetch(`${audiusHost}/v1/playlists/${playlistId}/tracks`);
        const data = await response.json();

        if (!data || !data.data) return [];

        return data.data.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.user.name,
            duration: track.duration || 30, // Default to 30s if missing
            artworkUrl: track.artwork['150x150'] || "" // Small thumbnail
        }));
    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        return [];
    }
}

async function loadPlaylistFromLink(storeId: number, url: string) {
    if (storePlaylistLoaded.get(storeId)) {
        console.log(`Playlist already loaded for store ${storeId}. Skipping fetch.`);
        return;
    }

    if (!audiusHost) {
        console.log("Waiting for Audius host selection...");
        await selectAudiusHost(); // Ensure a host is selected before continuing
    }

    console.log('audio host is', audiusHost)
    console.log('store audio playlist is', url)

    const permalink = extractPlaylistPermalink(url);
    if (!permalink) {
        console.error("Invalid Audius playlist URL.");
        return;
    }

    const playlistQuery = extractPlaylistName(url);
    if (!playlistQuery) {
        console.error("Invalid Audius playlist URL.");
        return;
    }

    console.log('permalink is', permalink)

    const playlistId = await searchPlaylist(permalink, playlistQuery);
    if (!playlistId) {
        console.error(`Playlist not found for store ${storeId}.`);
        return;
    }
    
    console.log('playlist id is', playlistId)

    const trackList = await fetchPlaylistTracks(playlistId);
    storeTrackLists.set(storeId, trackList);
    console.log(`Loaded Playlist Tracks for store ${storeId}:`, trackList);

    storePlaylistLoaded.set(storeId, true);
}


async function playTrack(index: number, eslapsedTime = 0) {
    if (!currentStoreId || !storeTrackLists.has(currentStoreId)) return;

    const trackList = storeTrackLists.get(currentStoreId);
    if (!trackList || trackList.length === 0) return;

    const track = trackList[index];

    // Save track index for this store
    storeCurrentTrackIndex.set(currentStoreId, index);
    storeResumeTime.set(currentStoreId, 0); // Reset resume time on new track

    // Play the track from the given timestamp
    let audio = AudioStream.getMutableOrNull(shopAudioEntity)
    if(!audio){
        return
    }
    audio.playing = false
    AudioStream.deleteFrom(shopAudioEntity)

    let shop = shops.get(currentStoreId)

     // Fetch the stream URL just before playing
     const streamUrl = await getTrackStreamUrl(track.id);
     if (!streamUrl) {
         console.error(`Failed to get stream URL for track: ${track.title}`);
         return;
     }
 

    console.log('streaumrl is', streamUrl)
    AudioStream.createOrReplace(shopAudioEntity,
        {
            url:streamUrl,
            playing:true,
            volume:shop.audio.volume
        }
    )
    
    console.log(`Now playing: ${track.title} by ${track.artist} in store ${currentStoreId} ${track.duration}`);

    // Update UI
    // updateTrackUI(track);

    // Track when the track started playing
    storeElapsedTime.set(currentStoreId, eslapsedTime);

    // Stop any existing timer before starting a new one
    if (trackInterval) {
        utils.timers.clearInterval(trackInterval);
    }

    // Schedule the next track dynamically based on remaining time
    // const remainingTime = track.duration - resumeTime;
    // trackTimer = utils.timers.setTimeout(() => {
    //     let nextTrackIndex = (index + 1) % trackList.length;
    //     storeElapsedTime.set(currentStoreId, 0);
    //     playTrack(nextTrackIndex);
    // }, remainingTime * 1000);

    trackInterval = utils.timers.setInterval(()=>{
        let eslapsedTime = storeElapsedTime.get(currentStoreId)!;
        // if(!eslapsedTime) return

        eslapsedTime += 1
        storeElapsedTime.set(currentStoreId, eslapsedTime)

        console.log('elapsed time', eslapsedTime)
        if(eslapsedTime > track.duration){
            console.log('playing next track')
            let nextTrackIndex = (index + 1) % trackList.length;
            playTrack(nextTrackIndex)
        }
    }, 1000)

}

async function getTrackStreamUrl(trackId: string): Promise<string | null> {
    if (!audiusHost) {
        console.log("Waiting for Audius host selection...");
        await selectAudiusHost(); // Ensure a host is selected before continuing
    }

    try {
        const response = await fetch(`${audiusHost}/v1/tracks/${trackId}/stream` + "?app_name=angzaar-plaza&t=" +Math.floor(Date.now()/1000));
        if (!response.ok) {
            console.error(`Failed to get stream URL for track ${trackId}`);
            return null;
        }
        return response.url; // Audius API returns a direct streamable URL
    } catch (error) {
        console.error("Error fetching track stream URL:", error);
        return null;
    }
}



export async function startAudio(storeId:number){
    console.log(`Player entered store: ${storeId}`);

    if (!storePlaylistLoaded.get(storeId)) {
        console.log(`Fetching playlist for store ${storeId}...`);
        let shop = shops.get(storeId)
        if(!shop || shop.audio.playlist === ""){
            return
        }
        
        await loadPlaylistFromLink(storeId, shop.audio.playlist);
    }

    startPlaylist(storeId); // Play store’s playlist
}

export function stopAudio(storeId:number){
    let audio = AudioStream.getMutableOrNull(shopAudioEntity)
    if(!audio){
        console.log('no audio soruce')
        return
    }
    
    if (trackInterval) {
        utils.timers.clearTimeout(trackInterval); // Stop timer
    }

    const audioSource = AudioStream.getMutable(shopAudioEntity);
    audioSource.playing = false;
    storeIsPaused.set(storeId, true);
    // console.log(`Paused store ${storeId} at track ${currentTrackIndex + 1}, time ${currentTime}s`);
}

function startPlaylist(storeId: number) {
    currentStoreId = storeId;

    const trackList = storeTrackLists.get(storeId);
    if (!trackList || trackList.length === 0) {
        console.log(`Store ${storeId} has no tracks.`);
        return;
    }

    // Get the last known track & position
    let trackIndex = storeCurrentTrackIndex.get(storeId) || 0;
    let resumeTime = storeResumeTime.get(storeId) || 0;
    let isPaused = storeIsPaused.get(storeId) || false;

    if (isPaused) {
        console.log(`Resuming store ${storeId} track ${trackIndex + 1} from ${resumeTime}s`);
        storeIsPaused.set(storeId, false);
        playTrack(trackIndex, resumeTime);
    } else {
        console.log(`Starting playlist for store ${storeId} from the beginning`);
        storeCurrentTrackIndex.set(storeId, 0);
        storeResumeTime.set(storeId, 0);
        playTrack(0);
    }
}

export async function updateAudio(shop:any){
    let audio = AudioStream.getMutableOrNull(shopAudioEntity)
    if(!audio){
        return
    }

    if(shop.audio.e){
        audio.volume = shop.audio.volume
    }
}

export function createShopAudioEntity(){
    shopAudioEntity = engine.addEntity()
    Transform.create(shopAudioEntity, {position:Vector3.create(44, 0, -41)})
    // AvatarAttach.create(shopAudioEntity, {anchorPointId:AvatarAnchorPointType.AAPT_HEAD})
    AudioStream.create(shopAudioEntity, {
        url:"",
        playing:false,
        volume:0,
    })
}