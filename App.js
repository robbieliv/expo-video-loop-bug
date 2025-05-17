import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { PixelRatio, StyleSheet, View, Button, Dimensions, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const videoHeight = (screenWidth * 9) / 16; // Assuming 16:9 aspect ratio

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

export default function VideoScreen() {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useManualLoop, setUseManualLoop] = useState(false); // State for manual loop toggle

  const player = useVideoPlayer(videoSource, player => {
    // Initial player.loop state will be managed by the useEffect below,
    // triggered by the initial useManualLoop state.
  });

  // Effect to manage player.loop based on useManualLoop state
  useEffect(() => {
    if (player) {
      if (useManualLoop) {
        player.loop = false;
        console.log('MANUAL LOOP MODE: player.loop has been set to false.');
      } else {
        player.loop = true;
        console.log('NATIVE LOOP MODE: player.loop has been set to true.');
      }
    }
  }, [player, useManualLoop]);

  // Event listeners using useEventListener
  useEventListener(player, 'playToEnd', () => {
    console.log('*************************************');
    console.log('DEBUG: Event: playToEnd HAS FIRED!');
    console.log('DEBUG: Current player.loop state in playToEnd:', player.loop);
    console.log('DEBUG: Current useManualLoop state in playToEnd:', useManualLoop);
    console.log('*************************************');

    if (useManualLoop) {
      console.log('Manual Loop Active: Video ended. Attempting to restart manually.');
      player.currentTime = 0;
      player.play();
    } else if (player.loop) {
      // This branch will be hit if native loop is on.
      // The prominent DEBUG logs for playToEnd will still appear.
      console.log('Native Loop Active: Video finished and player.loop is true. Video should restart automatically by player.');
    } else {
      console.log('Video finished. Native loop is off, and Manual loop is off.');
    }
  });

  useEventListener(player, 'playbackRateChange', (event) => {
    console.log('Event: playbackRateChange, New Rate:', event.playbackRate, 'Old Rate:', event.oldPlaybackRate);
  });

  useEventListener(player, 'playingChange', (event) => {
    console.log('Event: playingChange, Is Playing:', event.isPlaying, 'Old Is Playing:', event.oldIsPlaying);
    setIsPlaying(event.isPlaying);
  });

  useEventListener(player, 'sourceChange', (event) => {
    console.log('Event: sourceChange, New Source:', event.newSource, 'Previous Source:', event.previousSource);
  });

  useEventListener(player, 'statusChange', (event) => {
    console.log('Event: statusChange, New Status:', event.newStatus, 'Old Status:', event.oldStatus);
    if (event.error) {
      console.error('!!! Player Error in statusChange:', event.error);
    }
  });

  useEventListener(player, 'volumeChange', (event) => {
    console.log('Event: volumeChange, New Volume:', event.volume, 'Old Volume:', event.oldVolume, "Is Muted:", event.isMuted);
  });

  useEffect(() => {
    if (!player) return; // Guard against player not being initialized

    console.log('Player instance initialized or changed. videoSource constant value:', videoSource);
    // Log initial properties once player is definitely available
    // Note: player.loop might be quickly overridden by the useManualLoop effect
    console.log('Initial player properties (after setup - player.loop may be immediately changed by mode):');
    console.log('  currentTime:', player.currentTime);
    console.log('  duration:', player.duration);
    console.log('  isLive:', player.isLive);
    console.log('  loop (initial before mode effect):', player.loop);
    console.log('  muted:', player.muted);
    console.log('  playbackRate:', player.playbackRate);
    console.log('  playing:', player.playing);
    console.log('  source:', player.source);
    console.log('  status:', player.status);
    console.log('  volume:', player.volume);

    return () => {
      console.log('Player instance being released or component unmounting.');
    };
  }, [player]); // Re-run if player instance changes

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        // Adding an onPress to VideoView for quick play/pause, useful on touch devices.
        onPress={() => {
          if (player?.playing) { // Added player null check
             console.log('Action: VideoView pressed, player.pause()');
             player.pause();
           } else if (player) { // Added player null check
             console.log('Action: VideoView pressed, player.play()');
             player.play();
           }
        }}
      />
      <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>
        Loop Mode: {useManualLoop ? "Manual" : "Native (player.loop)"}
      </Text>
      <Text style={{ marginVertical: 5, fontStyle: 'italic' }}>
        (Player's internal player.loop is currently: {player?.loop ? 'true' : 'false'})
      </Text>
      <View style={styles.controlsContainer}>
         <Button
          title={isPlaying ? 'Pause Video' : 'Play Video'}
          onPress={() => {
            if (player?.playing) { // Added player null check
              console.log('Action: Button pressed, player.pause()');
              player.pause();
            } else if (player) { // Added player null check
              console.log('Action: Button pressed, player.play()');
              player.play();
            }
          }}
        />
        <Button
          title={useManualLoop ? "Switch to Native Loop" : "Switch to Manual Loop"}
          onPress={() => {
            setUseManualLoop(!useManualLoop);
            console.log('Toggle Loop Mode: useManualLoop will be:', !useManualLoop);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20, // Ensure space for controls
  },
  video: {
    width: screenWidth,
    height: videoHeight,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  controlsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
