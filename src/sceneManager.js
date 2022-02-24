class SceneManager {
    constructor(game, debug) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.marker = new LevelMarker(this.game, 0, 0, 1, 0 ,0);
        this.marker.loadNext = false;

        this.debug = debug;

        //1 = intro level
        //2 = water level
        //3 = space level
        //4 = music level
        this.level = 1;

        //initially set the game in the title screen state
        this.title = true;
        this.endScreen = true;
        this.player = new Player(this.game, "default", 600,400, 0, 0, 0, 0, false);
        //Add the initial title screen to the game
        this.game.addEntity(new Title(this.game, 250, 250));
        this.checkStart();

    };

    //checks to see if game is starting for the first time
    //forced player to click on screen which enables sound
    checkStart() {
        if (this.game.click && this.title) {
            this.title = false;
            this.loadLevel(600, 400);
            //comment this for music
            // ASSET_MANAGER.pauseBackgroundMusic();

        }
    };

    //called byCheckStart to load the chosen level
    loadLevel(x, y) {

        this.marker.loadNext = false;
        this.clearEntities()
        if (this.level === 1) {this.loadLevelOne(x, y);}
        else if (this.level === 2) {this.loadWater(x, y);}
        else if (this.level === 3) {this.loadSpaceLevel(x, y);}
        else if (this.level === 4) {this.loadMusicLevel(x, y);}
        else if (this.level === 5) {this.loadEndScreen(x, y);}

    }

    loadLevelOne(x, y) {

        this.endScreen = false;
        this.clearEntities();
        this.marker = new LevelMarker(this.game, 9700, 100, 2, 200, 2000);
        this.player = new Player(this.game, "default", x, y, 10, 20, 9000);
        this.player.gravity = 28;
        this.game.addEntity(this.player);

        //uncomment line below to start music on page click
        // ASSET_MANAGER.playAsset(levelOne.music);

        levelOne.enemies.forEach(e => {
            let enemy = new Miniraser(this.game, e.x, e.y);
            this.game.addEntity(enemy);
        });


        levelOne.terrain.forEach(t => {
            let terrain = new Terrain(this.game, t.x, t.y);
            this.game.addEntity(terrain);
        });

        levelOne.powerUps.forEach(p => {
            let pUp = new powerUp(this.game, p.x, p.y);
            this.game.addEntity(pUp);
        });

        levelOne.clouds.forEach(c => {
            this.game.addEntity(new Cloud(this.game, c.x, c.y))
        });

        this.game.addEntity(this.marker);

        levelOne.SignPost.forEach(s => {
            let sign = new SignPost(this.game, s.x, s.y, s.choice, s.scale);
            this.game.addEntity(sign);
        });

    }
    
    loadWater(x, y) {

        this.endScreen = false;
        this.clearEntities();

        this.player = new Submarine(this.game, "submarine", x, y, 15, 10, 9000);
        this.player.gravity = 0;
        this.player.falling = false;
        this.game.addEntity(this.player);
        this.marker = new LevelMarker(this.game, 9000, -250, 3, 1024, 100);
      
        levelWater.powerUps.forEach(p => {
            let pUp = new powerUp(this.game, p.x, p.y);
            this.game.addEntity(pUp);
        });

        levelWater.signPost.forEach(s => {
            let sign = new SignPost(this.game, s.x, s.y, s.choice, s.scale);
            this.game.addEntity(sign);
        });
        
        levelWater.fish.forEach(f => {
            let fishes = new Fishes(this.game, f.x , f.y - 10);
             this.game.addEntity(fishes);
        }); 

         levelWater.singleSeahorse.forEach(sh => {
            let sea_horse = new SingleSeahorse(this.game, sh.x, sh.y-5);
            this.game.addEntity(sea_horse);
          }); 
         
        /*
         levelWater.doubleSeahorses.forEach(s => {
          let sea_horse = new Seahorses(this.game, s.x, s.y + 300);
          this.game.addEntity(sea_horse);
        }); */
        
        levelWater.starfish.forEach(st => {
            this.game.addEntity(new Starfish(this.game, st.x, st.y + 600));
        });

        levelWater.shark.forEach(sh => {
            this.game.addEntity(new Shark(this.game, sh.x, sh.y + 250));
        });  

        levelWater.squid.forEach(sq => {
            this.game.addEntity(new Squid(this.game, sq.x, sq.y + 750));
        });
        
        levelWater.squid_ink.forEach(sqi => {
            this.game.addEntity(new Squid_ink(this.game, sqi.x, sqi.y + 200));
        });

        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 0 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 2048 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 4096 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 6144 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 8192 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/water_background/water_backgroundnew.png'), 0, 0, 2048, 1024, 10240 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})


        this.game.addEntity(this.marker);

    }


    loadSpaceLevel(x, y) {

        this.endScreen = false;
        this.clearEntities();
        this.marker = new LevelMarker(this.game, 10000, 100, 4, 200, 2000);

        this.player = new Submarine(this.game, "submarine", x, y, 10, 10, 9000);
        this.player.gravity = 0;
        this.player.falling = false;
        this.game.addEntity(this.player);


        this.levelWidth = 10240;
        let meteor = new Meteor(gameEngine, this.levelWidth);
        meteor.setIt();
        gameEngine.addEntity(meteor);
        for (let i = 0; i < 40; i++) {
            meteor = new Meteor(gameEngine, this.levelWidth);
            gameEngine.addEntity(meteor);
        }

        this.game.addEntity(this.marker);
        this.game.addEntity(new SignPost(this.game, 9000, 850, 2, 0.4));

        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/backgrounds/space.png'), 0, 0, 2048, 1024, 0 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/backgrounds/space.png'), 0, 0, 2048, 1024, 1024 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/backgrounds/space.png'), 0, 0, 2048, 1024, 2048 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/backgrounds/space.png'), 0, 0, 2048, 1024, 3096 - this.game.camera.x/5, 0, 2048, 1024), update: () => null})


    }



    loadMusicLevel(x, y) {

        this.endScreen = false;
        this.clearEntities();
        this.marker = new LevelMarker(this.game, 9000, 100,1, 200, 2000);
        this.player = new Player(this.game, "default", x, y, 12, 10, 9000,0,false)
        this.player.gravity = 28;
        this.x = 100;

        this.game.addEntity(this.player);

        // iterate through all chord structures and add them to the game canvas
        musicLevel.chords.forEach(n => {
            let note = new Note(this.game, n.beat_offset, n.note_value, n.type, n.stem_direction, n.clef);
            this.game.addEntity(note);
        });

        musicLevel.barlines.forEach(b => {
            let barline = new Barline(this.game, b.position);
            this.game.addEntity(barline);
        });

        musicLevel.clefs.forEach(cl => {
            let clef = new Clefs(this.game, cl.x_position, cl.y_position, cl.type);
            this.game.addEntity(clef);
        });

        musicLevel.powerUps.forEach(p => {
            let pUp = new powerUp(this.game, p.x, p.y);
            this.game.addEntity(pUp);
        });

        // add sheet music background to canvas
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset('./assets/backgrounds/blank_sheet_music.png'), 0, 0, 13824 , 1024, 0- this.game.camera.x/2, 0 -this.game.camera.y, 13824, 1024), update: () => null})

        this.game.addEntity(this.marker);

    }

    loadEndScreen(x, y) {
        this.clearEntities();
        this.endScreen = true;
        this.marker = new LevelMarker(this.game, -300, 100, 1, 200, 2000);

        this.player = new Player(this.game, "default", 500, 100, 15, 10, false);

        this.game.addEntity(this.player);
        this.game.addEntity({draw: ctx => ctx.drawImage(ASSET_MANAGER.getAsset("./assets/backgrounds/end_screen/try_again.jpg"), 0, 0, 1200 , 1024, 0, 0, 1200, 1024), update: () => null})
        this.game.addEntity(this.marker);
        this.game.addEntity(new LevelMarker(this.game, 100, 100, 1));

    }

    //removes all entities from the canvas
    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };


    update() {

        if(this.player.dead){this.loadEndScreen(0,0)}
        const debug = document.getElementById("debug").checked;
        this.checkStart();
        if(this.game.click) {this.title = false;}
        this.updateAudio();
        let {width: w, height: h} = this.game.ctx.canvas
        if(this.endScreen){this. x = 0;}
        // // console.log(this.player.x);
        // console.log(this.player.y);
        if (this.endScreen === false && (this.player.x < this.player.x_cameraLimit && this.player.x >= 600)){
            this.x = (this.player.x - w / 2); // Keep camera centered on storm at all times
            // If storm nears the bottom of the frame, pan the camera to keep him in frame
            // let ph = this.player.BB.height;
            // if (this.player.y - this.y > h - ph) {
            //     this.y = this.player.y - (h - ph)
            // }
        }
        //If storm is falling and in the upper half of the canvas, track him until he sees the floor
        else if(this.player.falling && this.player.y - this.y > h/2 && this.player.y < h/2) {
            this.y = this.player.y - h/2
        }
        // //If storm gets very high, pan the camera up just enough to keep him in frame
        // else if(this.player.y - this.y < ph / 2) {
        //     this.y = this.player.y - ph / 2;
        // }

        if(this.marker.loadNext === true) {
            this.level = this.marker.id
            this.loadLevel(600, 450);
        }
    }

    updateAudio() {
        const mute = document.getElementById("mute").checked;
        const volume = document.getElementById("volume").value;
        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

}