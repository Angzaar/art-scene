import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { SOUND_TYPES } from "./types"

//npx sdk-commands deploy -t linker-server.decentraland.org --skip-validations true

export let colorsLabels:string[] = [
    "Black",
    "Blue",
    "Gray",
    "Green",
    "Magenta",
    "Purple",
    "Red",
    "Teal",
    "Yellow",
    "White",
]

export let colors:Color4[] = [
    Color4.Black(),
    Color4.Blue(),
    Color4.Gray(),
    Color4.Green(),
    Color4.Magenta(),
    Color4.Purple(),
    Color4.Red(),
    Color4.Teal(),
    Color4.Yellow(),
    Color4.White(),
]


export let dclColors:any = {
    // transparent: Color4.create(0,0,0,0),//
    uncommon: Color4.create(246/255, 121/255, 89/255),
    common: Color4.create(188/255, 206/255, 206/255),
    rare: Color4.create(65/255, 210/255, 124/255),
    epic: Color4.create(74/255, 140/255, 234/255),
    legendary: Color4.create(150/255, 67/255, 228/255),
    exotic: Color4.create(.83, 1, .74),
    mythic: Color4.create(247/255, 109/255, 226/255),
    unique: Color4.create(250/255, 204/255, 32/255),
}

export let audiusMoodEndpoints:any = {
    Chill:[
    "v1/full/playlists/top?limit=20&mood=peaceful&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=easygoing&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=melancholy&type=playlist&with_users=true",
    ],

    Upbeat:[
    "v1/full/playlists/top?limit=20&mood=upbeat&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=excited&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=energizing&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=empowering&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=cool&type=playlist&with_users=true",
    ],

    Intense:[
    "v1/full/playlists/top?limit=20&mood=rowdy&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=fiery&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=defiant&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=aggressive&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=gritty&type=playlist&with_users=true",
    ],

    Provoking:[
    "v1/full/playlists/top?limit=20&mood=sophisticated&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=brooding&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=serious&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=stirring&type=playlist&with_users=true",
    ],

    Intimate:[
    "v1/full/playlists/top?limit=20&mood=sentimental&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=romantic&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=yearning&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=sensual&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=tender&type=playlist&with_users=true",
    ],
}

export let models:any = {
    gallery:"assets/gallery.glb",
    galleryElevator:"assets/gallery-elevator.glb"//
}

export default {
    DEBUG: false, 
    allowNoWeb3:false,

    slug:"angzaar::art::gallery::",

    lobby:"0x3edfae1ce7aeb54ed6e171c4b13e343ba81n-669b6",

    endpoints:{
        wsTest: "ws://localhost:5353",
        wsProd: "wss://angzaar-plaza.dcl-iwb.co/ws",

        deploymentTest: "http://localhost:3525",
        deploymentProd: "https://deployment.dcl-iwb.co",//

        toolsetTest: "http://localhost:3000",
        toolsetProd: "https://dcl-iwb.co/toolset/qa",

        validateTest: "http://localhost:2751",

        assetSign: "/scene/sign",
        dclNamesGraph:"https://subgraph.decentraland.org/marketplace",
        dclLandGraph:"https://subgraph.decentraland.org/land-manager",
        dclApi: "https://api.decentraland.org/v1/",

        proxy:"https://lkdcl.co/dcl/proxy/?url=",
        dclMarketplaceItem:"https://decentraland.org/marketplace/contracts/"
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
        opaquePurple: Color4.create(1,0,1,0.4),
        opaqueBlue: Color4.create(0,0,1,0.4),
        opaqueGreen: Color4.create(0,1,0,0.4),
        opaqueRed: Color4.create(1,0,0,0.4),
        opaqueYellow: Color4.create(1,1,0,.7)
    },

    textures:{
        iwbLogo: "https://lsnft.mypinata.cloud/ipfs/QmdMHovmwDtjWyZURMKVXphZxLPsL6MVMrvd2fSBFMwM1o",
        atlas1:"images/atlas1.png",
        atlas2:"images/atlas2.png",
        audiusIcon:"https://lsnft.mypinata.cloud/ipfs/QmWTASViZ1XGXqeRqJJjdBgAr98rcDXbwurjhBHJNCBuBC",
        audiusPlayerBG:"https://lsnft.mypinata.cloud/ipfs/QmeegEEPVFzkfKErEXnKkLeq9ny26hQ5i35SBBT7yNPZGP",
        audiusPlayerCatBG:"https://lsnft.mypinata.cloud/ipfs/QmNbemMVip9GDfPARNqzmsjRFG1NKAvp7LFo5L6RswiA47",
        audiusPlayerNoSelectCatBG:"https://lsnft.mypinata.cloud/ipfs/QmYHV3h6zcAqzRQmJUnqjeRdLUtn9JdgneLtXaZzSCLNJb",
        audiusInfoPanelBG:"https://lsnft.mypinata.cloud/ipfs/QmQXXrRuLmGV2JDcpb5S34Wag2jqXJqJWSTN7UTqPudJr2",
        audiusTrendingItemBG:"https://lsnft.mypinata.cloud/ipfs/QmZvYkYC9gSFw3gveGG7jRs3vQnh2uF8PoFxYkRGYdYSxB",
        audiusPlayButton:"https://lsnft.mypinata.cloud/ipfs/QmRX4KUUJgfiBdJGiV1m77avWmTUo2naxsh4q3KNMhGQQe",
        audiusShuffleButton:"https://lsnft.mypinata.cloud/ipfs/QmZbNTAeZxaJDHefGDscjyz2hLHdG3692SY4X16oWLeekj",
        audiusShuffleButtonOn:"https://lsnft.mypinata.cloud/ipfs/QmYNNUQp8GCcaP2i1JbsR3STPjqExDai5D4WfF5LzhK4d2",
        audiusRewindButton:"https://lsnft.mypinata.cloud/ipfs/QmVf9tV7JDCM4oVtuUUKAksW6CvyPLCVC3yPLFLz1ymHK7",
        audiusSeekButton:"https://lsnft.mypinata.cloud/ipfs/QmPt7bxKndTR812mUAvcMqg9bXaTgxxoFxrHZy5T47mhwC",
        audiusRepeatButton:"https://lsnft.mypinata.cloud/ipfs/QmcDc7ketU77r2bgLCKm1FjRuSMpXxPkyLGX3wZserNTVh",
        audiusRepeatButtonOn:"https://lsnft.mypinata.cloud/ipfs/QmTYunrPsFcUefayKnMGijddBBt32n9AQFoyfA9iPBu9MS",
        audiusPauseButton:"https://lsnft.mypinata.cloud/ipfs/QmRP5gx5MRRPRKt7SsnmkQ58o5FZQnfJkmJKHuMBCVqF1c",
        audiusVolumeIcon:"https://lsnft.mypinata.cloud/ipfs/QmeiPHeTKJMEXtqE6T9gu9QGLgfLpAwtE39KYfZTjTScyf",
        audiusVolumeBG:"https://lsnft.mypinata.cloud/ipfs/QmPtkGm5ha9gfQii1M8F373pbaApKWijmz32c7dZcNsnY3",
        audiusVolumePill:"https://lsnft.mypinata.cloud/ipfs/QmaX5fLrNas9mmFyeqZk4415xdyyZvLy1pwbj3rM7jKRXa",
        audiusTrendingBG:"https://bafkreie5li7sqkrkwu3uviqtinlu5mpraim7bz3qna5xtwmzvqopxojx2q.ipfs.nftstorage.link/",
        audiusUndergroundBG:"https://bafkreic25ontlwqenzekgqgeba65rm2bxhfa5vrwuprfbmmispmglbm2f4.ipfs.nftstorage.link/",
        audiusFeelingLuckyBG:"https://bafkreicjywp36jp4fvechgnsxvvq2xo4lkxynelzcrregxqcijewxvttdy.ipfs.nftstorage.link/",
        audiusTopAlbums:"https://bafkreigscpgvfg5cjbhme7fkrv4ymgnlj27vvb6houxgv4q3pkmynoklku.ipfs.nftstorage.link/",
        audiusChillBG:"https://bafkreiedy4fqz7jdmnx4f24g242c4566nrajchxmxducllq6whjauzae5u.ipfs.nftstorage.link/",
        audiusUpbeatBG:"https://bafkreihsgnjerkmd44ctnekpltzjll3m5jwcup7ip2khwmujdffganeegu.ipfs.nftstorage.link/",
        audiusIntenseBG:"https://bafkreiekgmf7um3tvc4qxosn4ytm2vfa4do37kep45wykqpal3iekgkdhe.ipfs.nftstorage.link/",
        audiusProvokingBG:"https://bafkreib5e3pv2nmwdockgsbqybnu77p4bbjv45ay2o7ddt4bbyoyli3yrq.ipfs.nftstorage.link/",
        audiusIntimateBG:"https://bafkreidltzure7laiqpjlwzthzodrd2p3w4wwcrvw2wu76plz33und7c5y.ipfs.nftstorage.link/",
        audiusMoodBG:"https://lsnft.mypinata.cloud/ipfs/QmanXaAyUy4kVYVNaPK3JjaqubLJAL6kmgubNcEXwAELoc",
    },

    uvs:{
        audiusIcon:{
            atlasHeight: 128,
            atlasWidth: 128,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 128,
            sourceHeight: 128
        },
        audiusPlayerBG:{
            atlasHeight: 237,
            atlasWidth: 916,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 916,
            sourceHeight: 237
        },
        audiusPlayerCatBG:{
            atlasHeight: 35,
            atlasWidth: 161,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 161,
            sourceHeight: 35
        },
        audiusInfoPanelBG:{
            atlasHeight: 436,
            atlasWidth: 436,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 436,
            sourceHeight: 436
        },
        audiusTrendingItemBG:{
            atlasHeight: 194,
            atlasWidth: 856,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 856,
            sourceHeight: 194
        },
        audiusPlayButton:{
            atlasHeight: 93,
            atlasWidth: 93,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 93,
            sourceHeight: 93
        },
        audiusShuffleButton:{
            atlasHeight: 16,
            atlasWidth: 24,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 24,
            sourceHeight: 16
        },
        audiusRewindButton:{
            atlasHeight: 20,
            atlasWidth: 39,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 39,
            sourceHeight: 20
        },
        audiusSeekButton:{
            atlasHeight: 20,
            atlasWidth: 38,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 38,
            sourceHeight: 20
        },
        audiusRepeatButton:{
            atlasHeight: 23,
            atlasWidth: 24,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 24,
            sourceHeight: 23
        },
        audiusVolumeButton:{
            atlasHeight: 67,
            atlasWidth: 67,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 67,
            sourceHeight: 67
        },
        audiusVolumeBG:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
        audiusVolumePill:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
        audiusTrendingBG:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
    },
    
    audioClips:[
        {key:SOUND_TYPES.ATMOS_BLESSING, name:"Blessing Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.WOOD_3, name:"Wood 3", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DOORBELL, name:"Doorbell Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DROP_1_STEREO, name:"Drop 1 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.SELECT_3, name:"Select 3 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.ERROR_2, name:"Error 2 Stereo", loop:false, attach:true, volume:.5},
    ],

    audius:{
        endpoints:{
            trending:"v1/tracks/trending?time=week&limit=45&offset=0",
            artist:"v1/full/users/handle/",
            stream:"v1/tracks",
            trendingPlaylists: "v1/playlists/trending",
            topalbums:"v1/full/playlists/top?limit=20&type=album&with_users=true",
            underground:"v1/full/tracks/trending/underground?limit=11&offset=0",
            playlistInfo: "v1/playlists",
            trackInfo:"v1/tracks",
            feelingLucky:"v1/full/tracks/feeling_lucky?limit=25&with_users=false",
            search:"v1/playlists/search?query=",
            searchTracks:"v1/tracks/search?query="
        },
        servers:[
            "https://audius-discovery-6.cultur3stake.com",
            "https://discovery.grassfed.network",
            "https://audius-discovery-2.theblueprint.xyz",
            "https://audius-discovery-15.cultur3stake.com",
            "https://audius-discovery-12.cultur3stake.com",
            "https://audius-discovery-11.cultur3stake.com",
            "https://dn2.monophonic.digital",
            "https://discovery-us-01.audius.openplayer.org",
            "https://dn-jpn.audius.metadata.fyi",
            "https://blockdaemon-audius-discovery-06.bdnodes.net",
            "https://audius-discovery-13.cultur3stake.com",
            "https://audius-metadata-5.figment.io",
            "https://dn1.matterlightblooming.xyz",
            "https://audius-metadata-4.figment.io",
            "https://audius-disco.ams-x01.nl.supercache.org",
            "https://audius-discovery-17.cultur3stake.com",
            "https://audius-discovery-8.cultur3stake.com",
            "https://blockdaemon-audius-discovery-07.bdnodes.net",
            "https://audius-metadata-3.figment.io",
            "https://audius-metadata-2.figment.io",
            "https://blockchange-audius-discovery-01.bdnodes.net",
            "https://blockchange-audius-discovery-03.bdnodes.net",
            "https://blockdaemon-audius-discovery-02.bdnodes.net",
            "https://audius-discovery-2.cultur3stake.com",
            "https://audius-discovery-18.cultur3stake.com",
            "https://audius-metadata-1.figment.io",
            "https://dn1.nodeoperator.io",
            "https://blockdaemon-audius-discovery-03.bdnodes.net",
            "https://blockchange-audius-discovery-02.bdnodes.net",
            "https://blockdaemon-audius-discovery-01.bdnodes.net",
            "https://audius-disco.dfw-x02.us.supercache.org",
            "https://audius-discovery-3.altego.net",
            "https://audius-discovery-3.cultur3stake.com",
            "https://dn1.monophonic.digital",
            "https://audius-discovery-4.cultur3stake.com",
            "https://audius-dp.amsterdam.creatorseed.com",
            "https://blockdaemon-audius-discovery-04.bdnodes.net",
            "https://audius-discovery-5.cultur3stake.com",
            "https://audius-discovery-10.cultur3stake.com",
            "https://audius-discovery-1.theblueprint.xyz",
            "https://audius-dp.singapore.creatorseed.com",
            "https://audius-discovery-4.theblueprint.xyz",
            "https://audius-discovery-9.cultur3stake.com",
            "https://dn-usa.audius.metadata.fyi",
            "https://disc-lon01.audius.hashbeam.com",
            "https://discoveryprovider.audius.co",
            "https://audius-discovery-1.altego.net",
            "https://blockdaemon-audius-discovery-08.bdnodes.net",
            "https://dn1.stuffisup.com",
            "https://audius-discovery-3.theblueprint.xyz",
            "https://audius-discovery-16.cultur3stake.com",
            "https://blockdaemon-audius-discovery-05.bdnodes.net",
            "https://discovery-au-02.audius.openplayer.org",
            "https://discoveryprovider2.audius.co",
            "https://audius.w3coins.io",
            "https://audius-discovery-14.cultur3stake.com",
            "https://audius-discovery-7.cultur3stake.com",
            "https://discoveryprovider3.audius.co",
            "https://audius-discovery-2.altego.net",
            "https://audius-discovery-1.cultur3stake.com",
            "creatornode.audius3.prod-us-west-2.staked.cloud"
          ]
    }
}


export let galleryLocations:any = [
    {id:29,
        label:"Outside Big Banner",
        position:Vector3.create(49.09, 10.36, 21.59), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(8.5,8.5,1),
        move:{x:42.28, y:3, z:13.44},
        look:{x:11, y:17, z:56.5},
        aspect:'1:1'},

{id:1,
label:"Outside Left Banner",
position:Vector3.create(46.11, 10.36, 21.59), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:42.28, y:3, z:13.44},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},


{id:2,
label:"Outside Center Banner",
position:Vector3.create(49, 10.36, 21.59), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:48.84, y:3, z:11.72},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},

{id:3,
label:"Outside Right Banner",
position:Vector3.create(51.9, 10.36, 21.59), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:55.09, y:3, z:12.54},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},


{id:4,
label:"Main Entrance Video",
position:Vector3.create(49, 5.16, 38.49), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(19.7,8.5,1),
move:{x:48.27, y:3, z:25.25},
look:{x:20.4, y:5, z:55.48},
aspect:'2.32:1'},


{id:5,
label:"Main Entrance Left",
position:Vector3.create(43, 5.16, 38.49), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(5,6,1),
move:{x:39.78, y:3, z:29.33},
look:{x:20.4, y:5, z:55.48},
aspect:'2.32:1'},

{id:6,
label:"Main Entrance Center",
position:Vector3.create(49, 5.16, 38.49), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(5,6,1),
move:{x:47.39, y:0, z:29.1},
look:{x:20.4, y:5, z:55.48},
aspect:'2.32:1'},

{id:7,
label:"Main Entrance Right",
position:Vector3.create(55, 5.16, 38.49),
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(5,6,1),
move:{x:58, y:0, z:29.07},
look:{x:20.4, y:5, z:55.48},
aspect:'2.32:1'},


{id:8,
label:"Left Front 1",
position:Vector3.create(30, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:29.39, y:0, z:35},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:9,
label:"Left Front 2",
position:Vector3.create(23, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:24.48, y:0, z:35},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:10,
label:"Left Front 3",
position:Vector3.create(16, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:16.26, y:0, z:35},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},


{id:11,
label:"Left Middle 1",
position:Vector3.create(24.23, 4.16, 42.21), 
rotation:Quaternion.fromEulerDegrees(0,270,0), 
scale:Vector3.create(4,5,1),
move:{x:30.41, y:0, z:42.39},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:12,
label:"Left Middle 2",
position:Vector3.create(24.23, 4.16, 45.21), 
rotation:Quaternion.fromEulerDegrees(0,270,0), 
scale:Vector3.create(4,5,1),
move:{x:30.41, y:0, z:45},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},



{id:13,
label:"Left Middle 3",
position:Vector3.create(24.23, 4.16, 48.21), 
rotation:Quaternion.fromEulerDegrees(0,270,0), 
scale:Vector3.create(4,5,1),
move:{x:30.41, y:0, z:49},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},



{id:14,
label:"Left Middle 4",
position:Vector3.create(23.78, 4.16, 42.21), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(4,5,1),
move:{x:17, y:0, z:42.39},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:15,
label:"Left Middle 5",
position:Vector3.create(23.78, 4.16, 45.21), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(4,5,1),
move:{x:17, y:0, z:45},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},



{id:16,
label:"Left Middle 6",
position:Vector3.create(23.78, 4.16, 48.21), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(4,5,1),
move:{x:17, y:0, z:49},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},


{id:17,
label:"Left Back 1",
position:Vector3.create(20, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:17.5, y:0, z:53},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:18,
label:"Left Back 2",
position:Vector3.create(26, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:25.5, y:0, z:53},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:19,
label:"Left Back 3",
position:Vector3.create(32, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:31.63, y:0, z:53},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},


{id:20,
label:"Right Back 1",
position:Vector3.create(65, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:66.53, y:0, z:50.84},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:21,
label:"Right Back 2",
position:Vector3.create(72, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:72.29, y:0, z:50.84},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:22,
label:"Right Back 3",
position:Vector3.create(79, 4.16, 59.81), 
rotation:Quaternion.fromEulerDegrees(0,0,0), 
scale:Vector3.create(4,5,1),
move:{x:79, y:0, z:50.84},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},



{id:23,
label:"Right Front 1",
position:Vector3.create(68, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:81.9, y:0, z:36.77},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:24,
label:"Right Front 2",
position:Vector3.create(75, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:75.3, y:0, z:36.77},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},

{id:25,
label:"Right Front 3",
position:Vector3.create(82, 4.16, 30.21), 
rotation:Quaternion.fromEulerDegrees(0,180,0), 
scale:Vector3.create(4,5,1),
move:{x:69.75, y:0, z:36.77},
look:{x:13.48, y:2, z:88},
aspect:'1:1.66',
trigger:Vector3.create(2,13,8)},


{id:26,
label:"Right Outside Banner 1",
position:Vector3.create(97.96,10.36,39.7), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:105.9, y:3, z:34.39},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},

{id:27,
label:"Right Outside Banner 2",
position:Vector3.create(97.96,10.36, 42.58), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:105.9, y:3, z:42.6},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},

{id:28,
label:"Right Outside Banner 3",
position:Vector3.create(97.96,10.36, 45.48), 
rotation:Quaternion.fromEulerDegrees(0,90,0), 
scale:Vector3.create(2.5,8.3,1),
move:{x:105.9, y:3, z:48.3},
look:{x:11, y:17, z:56.5},
aspect:'1:3.32'},
]


export let storeConfigs:any = [
    {
        position:Vector3.create(-8,0,8),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:1,
    },
    {
        position:Vector3.create(-8,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:2
    },
    {
        position:Vector3.create(-8,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:3
    },

    {
        position:Vector3.create(40,0,-8),
        rotation:Quaternion.fromEulerDegrees(0,180,0),
        id:4
    },
    {
        position:Vector3.create(24,0,-8),
        rotation:Quaternion.fromEulerDegrees(0,180,0),
        id:5
    },
    {
        position:Vector3.create(24,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0),
        id:6
    },
    {
        position:Vector3.create(40,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0),
        id:7
    },

    {
        position:Vector3.create(120,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,-90,0),
        id:8
    },

    {
        position:Vector3.create(120,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,-90,0),
        id:9
    },


    // //upper deck

    // {
    //     position:Vector3.create(40,15,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },
    // {
    //     position:Vector3.create(24,15,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },

    // {
    //     position:Vector3.create(40,30,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },
    // {
    //     position:Vector3.create(24,30,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // }
]

export let storeImageLocations:any = [
    {scale:Vector3.create(3,3,1), position:Vector3.create(6.85,2,4.3), rotation:Quaternion.fromEulerDegrees(0,90,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(6.85,2,-4.3), rotation:Quaternion.fromEulerDegrees(0,90,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(4.4,2,-6.8), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-4.4,2,-6.8), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-6.85,2,-4.3), rotation:Quaternion.fromEulerDegrees(0,270,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-6.85,2,4.3), rotation:Quaternion.fromEulerDegrees(0,270,0)},
]